import { Button as AntdButton } from 'antd';
import type { ButtonProps as AntdButtonProps } from 'antd';

type CustomButtonProps = AntdButtonProps;

const Button = (props: CustomButtonProps) => {
  return <AntdButton {...props} />;
};

export default Button;
