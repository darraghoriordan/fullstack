import * as React from 'react'
import { View } from 'react-native'
import gql from 'graphql-tag'
import styled from 'styled-components'
import { useOnboardUserMutation } from '../../../generated/graphql'
import Box from '../../../components/Box'
import Button from '../../../components/Button'
import OnboardPages from './OnboardPages'

export const ONBOARD_USER = gql`
  mutation OnboardUser($devopsAccount: DevopsAccountInput!) {
    onboardUser(devopsAccount: $devopsAccount)
  }
`

const BoxInner = styled(View)`
  flex: 1;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`

const Dot = styled(View)<{ active: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 100px;
  background-color: ${({ active }) =>
    active ? 'var(--dark-blue)' : 'var(--dark-moderate-blue-30)'};
`

const DotRow = styled(View)`
  width: 42px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`

const Onboard = (props: { done: () => void }) => {
  const onboardUser = useOnboardUserMutation()
  const [organisationUrl, setOrganisationUrl] = React.useState<string>('')
  const [accessToken, setAccessToken] = React.useState<string>('')
  const [page, setPage] = React.useState(0)
  const isNextDisabled = [!organisationUrl, !accessToken]

  const onPressDone = async () => {
    await onboardUser({
      variables: {
        devopsAccount: { accessToken: accessToken, organisationUrl: organisationUrl },
      },
    })
    props.done()
  }
  const lastPageIndex = 1
  return (
    <Box style={{ height: '75%' }}>
      <BoxInner>
        <OnboardPages
          organisationUrl={organisationUrl}
          accessCode={accessToken}
          page={page}
          setOrganisationUrl={setOrganisationUrl}
          setAccessToken={setAccessToken}
        />
        <View
          style={{ position: 'relative', marginBottom: 40, marginTop: 52, alignItems: 'center' }}
        >
          <DotRow>
            {[0, lastPageIndex].map((_, i) => (
              <Dot active={i === page} />
            ))}
          </DotRow>
          <Button
            onPress={
              page !== lastPageIndex
                ? () => setPage(page + 1)
                : () => {
                    onPressDone()
                  }
            }
            disabled={isNextDisabled[page]}
          >
            {page === lastPageIndex ? 'Done' : 'Next'}
          </Button>
        </View>
      </BoxInner>
    </Box>
  )
}

export default Onboard
