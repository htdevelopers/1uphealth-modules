import * as React from 'react';

interface Props {
  inputLabel: string;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}

class Input extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public renderInputIcon = (): JSX.Element => {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.6936 13.5352C13.4234 12.375 14.6959 9.22157 13.5357 6.49173C12.3756 
          3.76189 9.22212 2.48941 6.49228 3.64957C3.76244 4.80972 2.48996 
          7.96318 3.65011 10.693C4.81027 13.4229 7.96373 14.6953 10.6936 13.5352Z"
          stroke="#2A75FA"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.3902 12.3896L16.5556 16.5556"
          stroke="#2A75FA"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  render(): JSX.Element {
    const { inputProps, inputLabel } = this.props;

    return (
      <div className="input-container">
        <div className="input-container__label">{inputLabel}</div>
        <div
          className="input-container__wrapper"
        >
          <div className="input-container__wrapper__icon">{this.renderInputIcon()}</div>
          <input type="text" placeholder="Search"
          {...inputProps}
          />
        </div>
      </div>
    );
  }
}

export default Input;
