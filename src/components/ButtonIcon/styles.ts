import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity`
  height: 56px;
  width: 56px;
  justify-content: center;
  align-items: center;

  border-radius: 6px;

  background-color: ${({ theme }) => theme.COLORS.GRAY_600};
`;
