import * as React from 'react'
import { View, Text } from 'react-native'
import styled from 'styled-components'
import { useTransition, animated } from 'react-spring'
import Input from '../../../components/Input'

const PageWrapper = styled(View)`
  flex: 1;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`

const Title = styled(Text)`
  font-family: AvantGardePro;
  font-weight: 900;
  font-size: 24px;
  color: var(--dark-blue);
  letter-spacing: -1.09px;
  line-height: 50px;
  margin-top: 50px;
  margin-bottom: 36px;
`

const OrganisationNamePage = (props: {
  style: any
  value: string
  onChangeText: (text: string) => void
}) => (
  <animated.div style={props.style}>
    <PageWrapper>
      <Title>What is your organisation url?</Title>
      <Input
        style={{ width: 240, alignItems: 'center' }}
        inputStyle={{
          textAlign: 'center',
          alignItems: 'center',
          width: '100%',
          height: 55,
          borderRadius: 100,
        }}
        value={props.value}
        onChangeText={text => props.onChangeText(text)}
        keyboardType="default"
        placeholder="myorg"
        focusable
      />
      <View />
    </PageWrapper>
  </animated.div>
)

const AccessCodePage = (props: {
  style: any
  value: string
  onChangeText: (text: string) => void
}) => (
  <animated.div style={props.style}>
    <PageWrapper>
      <Title>What is your access code?</Title>
      <Input
        style={{ width: 240, alignItems: 'center' }}
        inputStyle={{
          textAlign: 'center',
          alignItems: 'center',
          width: '100%',
          height: 55,
          borderRadius: 100,
        }}
        value={props.value}
        onChangeText={text => props.onChangeText(text)}
        keyboardType="default"
        placeholder="abcdef-abcdef-abcdef-abcdef"
        focusable
      />
      <View />
    </PageWrapper>
  </animated.div>
)

interface OnboardPagesProps {
  page: number
  accessCode: string
  organisationUrl: string
  setOrganisationUrl: (text: string) => void
  setAccessToken: (text: string) => void
}

const OnboardPages = ({
  page,
  setAccessToken,
  setOrganisationUrl,
  accessCode,
  organisationUrl,
}: OnboardPagesProps) => {
  const transitions = useTransition(page, null, {
    initial: { opacity: 1, position: 'absolute', width: '100%', height: '100%', left: 0 },
    from: { opacity: 0, position: 'absolute', width: '100%', height: '100%', left: 300 },
    enter: { opacity: 1, left: 0 },
    leave: { opacity: 0, left: -300 },
  })

  return (
    <View style={{ flex: 1, width: '100%', zIndex: 1 }}>
      {transitions.map(({ item, props }) => {
        switch (item) {
          case 0:
            return (
              <OrganisationNamePage
                value={organisationUrl}
                onChangeText={setOrganisationUrl}
                style={props}
              />
            )
          case 1:
            return <AccessCodePage value={accessCode} onChangeText={setAccessToken} style={props} />
          default:
            return null
        }
      })}
    </View>
  )
}

export default OnboardPages
