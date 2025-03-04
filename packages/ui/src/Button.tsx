import { debounce } from '@acme/utils/debounce'
export interface ButtonProps {
  children: React.ReactNode;
}

export function Button(props: ButtonProps) {
  const debouncedClick = debounce(() => {
    console.log('button clicked');
  }, 300)
  return <button onClick={debouncedClick}>{props.children}</button>;
}

Button.displayName = "Button";
