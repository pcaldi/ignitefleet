import { useTheme } from 'styled-components/native';
import { Container, Input, Label } from './styles';
import { TextInputProps } from 'react-native';

type Props = TextInputProps & {
  label: string;
};

export function TextAreaInput({ label, ...rest }: Props) {
  const { COLORS } = useTheme();

  return (
    <Container>
      <Label>{label}</Label>
      <Input
        placeholderTextColor={COLORS.GRAY_400}
        autoCapitalize="sentences" /* Primeira letra Maiúscula */
        multiline
        {...rest}
      />
    </Container>
  );
}
