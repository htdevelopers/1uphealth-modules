import * as React from 'react';
import Api from '@1uphealth-temp/api/src/api-sdk';

interface Props {}

interface State {}

class Base extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
  }

  public getProviders = () => {
    const api = new Api({ clientId: 'test', clientSecret: 'test' });

    api.searchConnectProvider({ query: 'john' })
      .then(r => console.log(r))
      .catch(error => console.log(error));
  }

  render() {
    return <div className="provider-search-container">{this.props.children}</div>;
  }
}

export default Base;
