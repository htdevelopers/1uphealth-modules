import * as React from 'react';

interface Props {}

interface State {}

class Base extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <>
        {this.props.children}
      </>
    );
  }
}

export default Base;
