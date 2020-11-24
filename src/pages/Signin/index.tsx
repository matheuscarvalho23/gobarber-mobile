import React,{ useCallback, useRef } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
  TextInput,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from "@react-navigation/native";
import { Form } from "@unform/mobile";
import { FormHandles } from "@unform/core";
import * as Yup from 'yup';
import getValidationsErrors from '../../utils/getValidationsErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';
import Logo from '../../assets/logo.png';

import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountText
} from "./style";

interface SignInFormData {
  email: string;
  password: string;
}

const Signin: React.FC = () => {
  const formRef      = useRef<FormHandles>(null);
  const passInputRef = useRef<TextInput>(null);
  const navigation   = useNavigation();

  const handleSignIn = useCallback(async (data: SignInFormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        email: Yup.string().required('E-mail is required').email(),
        password: Yup.string().required('Password is required'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      // await signIn({
      //   email: data.email,
      //   password: data.password,
      // });
    } catch (err) {

      if (err instanceof Yup.ValidationError) {
        const errors = getValidationsErrors(err);

        formRef.current?.setErrors(errors);

        return;
      }

      Alert.alert(
        'Erro na autenticação',
        'correu um erro ao realizar o login, cheque as credenciais'
      );
    }
  }, []);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={(Platform.OS === 'ios') ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={Logo}/>

            <View>
              <Title>Faça seu Login</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSignIn}>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passInputRef.current?.focus();
                }}
              />
              <Input
                ref={passInputRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />

              <Button onPress={() => {
                  formRef.current?.submitForm();
                }}>
                Entrar
              </Button>
            </Form>

            <ForgotPassword onPress={() => {}}>
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
        <Icon name="log-in" size={20} color="#ff9000" />
        <CreateAccountText>Criar uma conta</CreateAccountText>
      </CreateAccountButton>
    </>
  );
}

export default Signin;
