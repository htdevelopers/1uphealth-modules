import * as React from 'react';
import axios from 'axios';
// import Api from '@1uphealth-temp/api';

import { HealthSystemI, FilteredDataObjectI, FHIROrganizationI } from './interfaces';

interface Props {
  token: string;
  getContext: (c : any) => any;
}

interface State {
  healthSystems: HealthSystemI[];
  fhirData: FHIROrganizationI[];
  filteredHealthSystems: FilteredDataObjectI[];
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
  /* tslint:disable */
  public fhirUrl = `http://localhost:3000/api/fhir-resources?accessToken=${this.props.token}&fhirVersion=dstu2&fhirResource=Organization&_public=true&identifier.system=https://1up.health/dev/concept/doc/1uphealth-system-identifier`;
  /* tslint:enable */

  public constructor(props: Props) {
    super(props);
    this.state = {
      healthSystems: [],
      fhirData: [],
      filteredHealthSystems: [],
      totalCount: 0,
      page: 0,
    };
  }

  public componentDidMount = (): void => {
    this.getHealthSystems();
    this.getFHIRResources();
  }

  public componentDidUpdate = (prevProps: Props): void => {
    const { token, getContext } = this.props;
    if (token !== prevProps.token) {
      this.getHealthSystems();
      this.getFHIRResources();
    }

    if (getContext !== undefined && typeof getContext === 'function') {
      this.returnContext(getContext);
    }
  }

  // API reqests
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
    const { page, fhirData } = this.state;

    const config = {
      ...this.requestConfig,
      /* tslint:disable */
      url: page === 0 ? this.fhirUrl : `${this.fhirUrl}&_skip=${page * 10}`,
      /* tslint:enable */
    };
    try {
      // @ts-ignore
      const fhirResponse = await axios(config);

      this.setState({
        fhirData: [...fhirData, ...fhirResponse.data.entry],
        totalCount: fhirResponse.data.total,
        page: page + 1,
      });
    } catch (error) {
      console.log(error);
    }
  }

  public prepareSingleDataObject = (row: HealthSystemI) => {
    // Add implementation for organizations

    if (row.logo !== undefined) {
      return {
        id: row.id,
        logo: row.logo,
        name: row.name,
        address: row.locations[0].address.line[0],
        city: row.locations[0].address.city,
        state: row.locations[0].address.state,
        zipcode: row.locations[0].address.postalCode,
      };
    }
  }

  public filterHealthSystems = (inputValue: string) => {
    const { healthSystems } = this.state;
    let filteredHealthSystems: any;
    if (inputValue.length > 0) {
      filteredHealthSystems =
        healthSystems.filter(hS => hS.name.toLowerCase().includes(inputValue.toLowerCase()))
        .map(hS => this.prepareSingleDataObject(hS));
    } else {
      filteredHealthSystems = [];
    }
    this.setState({
      filteredHealthSystems,
    });
  }

  public searchInputOnChange = (e: React.ChangeEvent<HTMLSelectElement>, func: any) => {
    const inputValue = e.target.value;
    this.filterHealthSystems(inputValue);

    // API request
    // --------------------------------
    if (func !== undefined) {
      return func(e);
    }
  }

  public prepareContextObject = () => {
    const { healthSystems, fhirData, filteredHealthSystems, totalCount } = this.state;

    return {
      totalCount,
      healthSystems,
      fhirData,
      filteredHealthSystems,
      getFHIRResources: this.getFHIRResources,
      searchInputOnChange: this.searchInputOnChange,
    };
  }

  public returnContext = (func: any) => {
    const contextValue = this.prepareContextObject();

    if (func !== undefined) {
      return func(contextValue);
    }
  }

  render() {
    const contextValue = this.prepareContextObject();
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
