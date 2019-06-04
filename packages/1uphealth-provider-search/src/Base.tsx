import * as React from 'react';
// import Api from '@1uphealth-temp/api';

interface Props {
  accessToken: string;
}

interface State {}

class Base extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
  }

  render() {
    return <div className="provider-search-container">{this.props.children}</div>;
  }
}

export default Base;
