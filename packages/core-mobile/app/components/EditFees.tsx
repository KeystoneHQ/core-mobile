import { Space } from 'components/Space'
import InputText from 'components/InputText'
import React, { useEffect, useMemo, useState } from 'react'
import FlexSpacer from 'components/FlexSpacer'
import { Row } from 'components/Row'
import { calculateGasAndFees, Eip1559Fees, GasAndFees } from 'utils/Utils'
import { Network } from '@avalabs/core-chains-sdk'
import { useNativeTokenPriceForNetwork } from 'hooks/networks/useNativeTokenPriceForNetwork'
import {
  Button,
  DividerLine,
  ScrollView,
  Text,
  View,
  alpha,
  useTheme
} from '@avalabs/k2-mobile'
import { Tooltip } from 'components/Tooltip'
import { useSelector } from 'react-redux'
import { selectSelectedCurrency } from 'store/settings/currency'
import { VsCurrencyType } from '@avalabs/core-coingecko-sdk'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { TokenUnit } from '@avalabs/core-utils-sdk'
import {
  bigIntToFeeDenomination,
  feeDenominationToBigint
} from 'utils/units/fees'

type EditFeesProps = {
  network: Network
  onSave: (customFees: Eip1559Fees) => void
  onClose?: () => void
  lowMaxFeePerGas: bigint
  isGasLimitEditable?: boolean
  isBaseUnitRate: boolean
  noGasLimitError?: string
} & Eip1559Fees

const maxBaseFeeInfoMessage =
  'The Base Fee is set by the network and changes frequently. Any difference between the set Base Fee and the actual Base Fee will be refunded.'
const maxPriorityFeeInfoMessage =
  'The Priority Fee is an incentive paid to network operators to prioritize processing a transaction.'
const gasLimitInfoMessage =
  'Total units of gas needed to complete the transaction. Do not edit unless necessary.'

function CurrencyHelperText({ text }: { text: string }): JSX.Element {
  return (
    <Row style={{ justifyContent: 'flex-end', paddingHorizontal: 16 }}>
      <Text variant="caption" sx={{ color: '$neutral300' }}>
        {text}
      </Text>
    </Row>
  )
}

const EditFees = ({
  lowMaxFeePerGas,
  maxFeePerGas: initMaxFeePerGas,
  maxPriorityFeePerGas: initMaxPriorityFeePerGas,
  gasLimit: initGasLimit,
  network,
  onSave,
  onClose,
  isGasLimitEditable,
  isBaseUnitRate,
  noGasLimitError
}: EditFeesProps): JSX.Element => {
  const _gasLimitError = noGasLimitError ?? 'Please enter a valid gas limit'
  const {
    theme: { colors }
  } = useTheme()
  const selectedCurrency = useSelector(
    selectSelectedCurrency
  ).toLowerCase() as VsCurrencyType
  const typeCreator = useMemo(
    () =>
      new TokenUnit(
        0,
        network.networkToken.decimals,
        network.networkToken.symbol
      ),
    [network]
  )
  const [newGasLimit, setNewGasLimit] = useState<string>(
    initGasLimit.toString()
  )
  /**
   * Denominated depending of network:
   * BTC - Satoshi
   * AVAX - nAVAX
   * EVM - gWei
   */
  const [newMaxFeePerGas, setNewMaxFeePerGas] = useState<string>(
    bigIntToFeeDenomination(initMaxFeePerGas, isBaseUnitRate)
  )
  /**
   * Denominated depending of network:
   * BTC - Satoshi
   * AVAX - nAVAX
   * EVM - gWei
   */
  const [newMaxPriorityFeePerGas, setNewMaxPriorityFeePerGas] =
    useState<string>(
      bigIntToFeeDenomination(initMaxPriorityFeePerGas, isBaseUnitRate)
    )
  const tokenPrice = useNativeTokenPriceForNetwork(network).nativeTokenPrice
  const [feeError, setFeeError] = useState('')
  const [gasLimitError, setGasLimitError] = useState('')
  const [newFees, setNewFees] = useState<GasAndFees>(
    calculateGasAndFees({
      maxFeePerGas: initMaxFeePerGas,
      maxPriorityFeePerGas: initMaxPriorityFeePerGas,
      tokenPrice,
      gasLimit: initGasLimit,
      networkToken: network.networkToken
    })
  )
  const maxTotalFee = useMemo(
    () =>
      new TokenUnit(
        newFees.maxTotalFee,
        network.networkToken.decimals,
        network.networkToken.symbol
      ).toDisplay(),
    [
      network.networkToken.decimals,
      network.networkToken.symbol,
      newFees.maxTotalFee
    ]
  )

  useEffect(() => {
    try {
      const fees = calculateGasAndFees({
        tokenPrice,
        maxFeePerGas: feeDenominationToBigint(newMaxFeePerGas, isBaseUnitRate),
        maxPriorityFeePerGas: feeDenominationToBigint(
          newMaxPriorityFeePerGas,
          isBaseUnitRate
        ),
        gasLimit: isNaN(parseInt(newGasLimit)) ? 0 : parseInt(newGasLimit),
        networkToken: network.networkToken
      })
      setNewFees(fees)
      setGasLimitError(fees.gasLimit <= 0 ? _gasLimitError : '')
      setFeeError(
        fees.maxFeePerGas < lowMaxFeePerGas ? 'Max base fee is too low' : ''
      )
    } catch (e) {
      setFeeError('Gas Limit is too much')
    }
  }, [
    feeError,
    initMaxFeePerGas,
    gasLimitError,
    newGasLimit,
    newMaxFeePerGas,
    newMaxPriorityFeePerGas,
    tokenPrice,
    typeCreator,
    lowMaxFeePerGas,
    _gasLimitError,
    isBaseUnitRate,
    network.networkToken
  ])

  const handleOnSave = (): void => {
    if (newGasLimit) {
      onSave({
        gasLimit: Number(newGasLimit),
        maxFeePerGas: newFees.maxFeePerGas,
        maxPriorityFeePerGas: newFees.maxPriorityFeePerGas
      })
      onClose?.()
    }
  }

  const saveDisabled = !!feeError || (newFees.gasLimit === 0 && !isBaseUnitRate)

  const sanitized = (text: string): string => text.replace(/[^0-9]/g, '')

  return (
    <SafeAreaProvider style={{ flex: 1, paddingBottom: 16 }}>
      <ScrollView>
        <Text
          variant="heading4"
          sx={{ color: '$neutral50', marginHorizontal: 12 }}>
          Edit Network Fee
        </Text>
        <Space y={24} />
        <InputText
          label={isBaseUnitRate ? 'Network Fee' : 'Max Base Fee'}
          testID="custom_network_fee_input"
          mode={'amount'}
          text={newMaxFeePerGas}
          keyboardType="numeric"
          popOverInfoText={isBaseUnitRate ? undefined : maxBaseFeeInfoMessage}
          onChangeText={text => setNewMaxFeePerGas(sanitized(text))}
          errorText={feeError}
        />
        {!isBaseUnitRate && (
          <>
            <InputText
              label={'Max Priority Fee'}
              mode={'amount'}
              keyboardType="numeric"
              text={newMaxPriorityFeePerGas}
              popOverInfoText={maxPriorityFeeInfoMessage}
              onChangeText={text => setNewMaxPriorityFeePerGas(sanitized(text))}
            />
            <InputText
              label={'Gas Limit'}
              mode={'amount'}
              text={newGasLimit}
              keyboardType="numeric"
              editable={isGasLimitEditable}
              popOverInfoText={gasLimitInfoMessage}
              onChangeText={text => setNewGasLimit(sanitized(text))}
              errorText={gasLimitError}
              backgroundColor={
                isGasLimitEditable
                  ? alpha(colors.$neutral800, 0.5)
                  : colors.$neutral900
              }
              borderColor={colors.$neutral800}
            />
          </>
        )}
        <View sx={{ paddingHorizontal: 16, marginTop: 20, marginBottom: 16 }}>
          <DividerLine />
        </View>
        <Row style={{ marginHorizontal: 12, alignItems: 'baseline' }}>
          {isBaseUnitRate ? (
            <TotalNetworkFeeText />
          ) : (
            <Tooltip
              style={{ width: 220 }}
              content={`Total Network Fee = (Current Base Fee + Max Priority Fee) * Gas Limit.\n\nIt will never be higher than Max Base Fee * Gas Limit.`}
              position={'bottom'}>
              <TotalNetworkFeeText />
            </Tooltip>
          )}
          <FlexSpacer />
          <Text variant="heading5" sx={{ color: '$neutral50' }}>
            {maxTotalFee}
          </Text>
          <Space x={4} />
          <Text variant="heading6" sx={{ color: '$neutral400' }}>
            {network?.networkToken?.symbol?.toUpperCase()}
          </Text>
        </Row>
        <CurrencyHelperText
          text={`${
            newFees.maxTotalFeeInCurrency
          } ${selectedCurrency.toUpperCase()}`}
        />
      </ScrollView>
      <Button
        testID="custom_network_fee_save_btn"
        type={'primary'}
        size={'xlarge'}
        disabled={saveDisabled}
        style={{ marginHorizontal: 16 }}
        onPress={handleOnSave}>
        Save
      </Button>
    </SafeAreaProvider>
  )
}

const TotalNetworkFeeText = (): JSX.Element => (
  <Text variant="caption" sx={{ color: '$neutral500' }}>
    Total Network Fee
  </Text>
)

export default EditFees
