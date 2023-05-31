import styled from 'styled-components/native';

export const Container = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 32px 24px;

  background-color: ${({ theme }) => theme.COLORS.GRAY_700};
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.COLORS.GRAY_100};
  font-size: ${({ theme }) => theme.FONT_SIZE.XL}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;
