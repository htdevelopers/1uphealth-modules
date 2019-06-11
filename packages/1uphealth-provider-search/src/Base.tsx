import * as React from 'react';
import axios from 'axios';
// import Api from '@1uphealth-temp/api';

interface Props {
  token: string;
}

interface State {
  healthSystems: any[];
  fhirData: any[];
  totalCount: number;
  page: number;
}

export const DataContext = React.createContext({});

class Base extends React.Component<Props, State> {
  public requestConfig = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  public constructor(props: Props) {
    super(props);
    this.state = {
      healthSystems: [],
      fhirData: [],
      totalCount: 0,
      page: 0,
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
      ...this.requestConfig,
      url: `http://localhost:3000/api/supported-health-systems?accessToken=${token}`,
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
      ...this.requestConfig,
      /* tslint:disable */
      url: `http://localhost:3000/api/fhir-resources?accessToken=${token}&fhirVersion=dstu2&fhirResource=Organization&_public=true&identifier.system=https://1up.health/dev/concept/doc/1uphealth-system-identifier`,
      /* tslint:enable */
    };
    try {
      // @ts-ignore
      const fhirResponse = await axios(config);

      console.log('FHIR -->', fhirResponse);

      this.setState({
        fhirData: fhirResponse.data.entry,
        totalCount: fhirResponse.data.total,
        page: 1,
      });
    } catch (error) {
      console.log(error);
    }
  }

  public loadMoreData = async () => {
    const { token } = this.props;
    const { page, fhirData } = this.state;
    const config = {
      ...this.requestConfig,
      /* tslint:disable */
      url: `http://localhost:3000/api/fhir-resources?accessToken=${token}&fhirVersion=dstu2&fhirResource=Organization&_public=true&identifier.system=https://1up.health/dev/concept/doc/1uphealth-system-identifier&_skip=${page * 10}`,
      /* tslint:enable */
    };
    try {
      // @ts-ignore
      const loadMoreFHIRData = await axios(config);

      this.setState({
        fhirData: [...fhirData, ...loadMoreFHIRData.data.entry],
        page: page + 1,
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { healthSystems, fhirData, totalCount } = this.state;

    const contextValue = {
      totalCount,
      healthSystems,
      fhirData,
      loadMoreData: this.loadMoreData,
    };

    return (
      <DataContext.Provider value={contextValue}>
        <div className="provider-search-container">
          {this.props.children}
        </div>
      </DataContext.Provider>
    );
  }
}

export default Base;
