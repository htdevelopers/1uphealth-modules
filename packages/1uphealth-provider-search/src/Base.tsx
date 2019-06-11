import * as React from 'react';
import axios from 'axios';
// import Api from '@1uphealth-temp/api';

interface Props {
  token: string;
}

interface State {
  healthSystems: any[];
  fhirData: any[];
}

export const DataContext = React.createContext({});

class Base extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      healthSystems: [],
      fhirData: [],
    };
  }

  public componentDidMount = (): void => {
    this.getHealthSystems();
    this.getFHIRResources();
  }

  public componentDidUpdate = (prevProps: Props): void => {
    const { token } = this.props;
    if (token !== prevProps.token) {
      this.getHealthSystems();
      this.getFHIRResources();
    }
  }

  public getHealthSystems = async (): Promise<any> => {
    const { token } = this.props;
    const config = {
      method: 'GET',
      url: `http://localhost:3000/api/health-systems?token=${token}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      // @ts-ignore
      const healthSystemsResponse = await axios(config);

      this.setState({
        healthSystems: healthSystemsResponse.data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  public getFHIRResources = async (): Promise<any> => {
    const { token } = this.props;
    const config = {
      method: 'GET',
      url: `http://localhost:3000/api/fhir-resources?token=${token}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      // @ts-ignore
      const fhirResponse = await axios(config);

      this.setState({
        fhirData: fhirResponse.data.entry,
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { healthSystems, fhirData } = this.state;
    return (
      <DataContext.Provider value={{ healthSystems, fhirData }}>
        <div className="provider-search-container">
          {this.props.children}
        </div>
      </DataContext.Provider>
    );
  }
}

export default Base;
