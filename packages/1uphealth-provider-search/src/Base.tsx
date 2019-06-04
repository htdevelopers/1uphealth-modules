import * as React from 'react';
import Api from '@1uphealth-temp/api';

interface Props {
  accessToken: string;
}

interface State {}

class Base extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
  }

  public getProviders = () => {
    const api = new Api({ clientId: 'test', clientSecret: 'test' });

    api.accessToken = '9007d8a3575241cb8d46877afffd5e96';
    api.searchConnectProvider({ query: 'john' })
      .then(r => console.log(r))
      .catch(error => console.log(error));
  }

  render() {
    this.getProviders();
    return <div className="provider-search-container">{this.props.children}</div>;
  }
}

export default Base;
