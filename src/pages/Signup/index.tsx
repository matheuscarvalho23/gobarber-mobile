import React, { useRef, useCallback } from 'react';
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

import Input from '../../components/Input';
import Button from '../../components/Button';
import Logo from '../../assets/logo.png';
import getValidationsErrors from '../../utils/getValidationsErrors';
import api from '../../services/api';

import {
  Container,
  Title,
  BackToSignIn,
  BackToSignInText
} from "./style";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  const emailInputRef = useRef<TextInput>(null);
  const passInputRef = useRef<TextInput>(null);
  const formRef       = useRef<FormHandles>(null);
  const navigation    = useNavigation();

  const handleSignUp = useCallback(async (data: object) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Name is required.'),
        email: Yup.string().required('E-mail is required').email(),
        password: Yup.string().min(6, 'At least 6 digits'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await api.post('/users', data);

      Alert.alert(
        'Cadastro realizado com sucesso !',
        'Você já pode fazer login na aplicação'
      );

      navigation.goBack();

    } catch (err) {

      if (err instanceof Yup.ValidationError) {
        const errors = getValidationsErrors(err);
        console.log(errors)

        formRef.current?.setErrors(errors);

        return;
      }

      Alert.alert(
        'Erro no cadastro',
        'Ocorreu um erro ao fazer o cadastro !'
      );

    }
  }, [navigation]);

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
              <Title>Crie sua conta</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSignUp}>
              <Input
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailInputRef.current?.focus();
                }}
              />
              <Input
                ref={emailInputRef}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                name="email"
                icon="mail"
                placeholder="E-mail"
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passInputRef.current?.focus();
                }}
              />
              <Input
                ref={passInputRef}
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="Senha"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button
                onPress={() => formRef.current?.submitForm()}
              >
                Entrar
              </Button>
            </Form>

          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignIn onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={20} color="#fff" />
        <BackToSignInText>Voltar para login</BackToSignInText>
      </BackToSignIn>
    </>
  );
}

export default Signup;
