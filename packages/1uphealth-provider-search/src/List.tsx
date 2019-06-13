import * as React from 'react';
import { DataContext } from './Base';
import InfiniteScroll from 'react-infinite-scroller';

interface Props {
  onClick: any;
}

interface Identifier {
  system: string;
  use: string;
  value: string;
}

class List extends React.Component<Props> {
  public static contextType = DataContext;
  constructor(props: Props) {
    super(props);
  }

  public returnHomeIcon = () => {
    return (
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 3.95825C9.99992 3.82922 9.94006 3.7075 9.83792 3.62866L5.25458
          0.0869976C5.10444 -0.0291925 4.89473 -0.0291925 4.74458
          0.0869976L0.16125 3.62866C0.059418 3.70767 -0.000117985 3.82936 1.75551e-07
          3.95825V9.58325C1.75551e-07 9.81337 0.186548 9.99992
          0.416667 9.99992H3.75C3.86506 9.99992 3.95833 9.90664 3.95833 9.79158V7.91658C3.95833
          7.34129 4.4247 6.87492 5 6.87492C5.5753 6.87492
          6.04167 7.34129 6.04167 7.91658V9.79158C6.04167 9.90664 6.13494 9.99992 6.25
          9.99992H9.58333C9.81345 9.99992 10 9.81337 10 9.58325V3.95825Z"
          fill="#2A75FA"
        />
      </svg>
    );
  }

  returnProperhealthSystem = (identifierArr: any): { logo: string; name: string } => {
    const { healthSystems } = this.context;
    const healthsystemId = identifierArr.find(
      (i: Identifier) => i.system.includes('1up.health')).value;

    // tslint:disable-next-line:radix
    const healthSystem = healthSystems.find((hS: any) => hS.id === parseInt(healthsystemId));

    if (healthSystem !== undefined) {
      return {
        logo: healthSystem.logo,
        name: healthSystem.name,
      };
    }

    return {
      logo: '-',
      name: '-',
    };
  }

  hasMoreRecords = (): boolean => {
    const { totalCount,  fhirData } = this.context;

    if (fhirData.length < totalCount) {
      return true;
    }

    return false;
  }

  public render(): JSX.Element {
    const { onClick } = this.props;
    const { healthSystems, fhirData, getFHIRResources } = this.context;

    if (healthSystems.length > 0 && fhirData.length > 0) {
      return (
        <div className="list-container">
          <div className="list-container__wrapper">
            <InfiniteScroll
              pageStart={1}
              initialLoad={false}
              loadMore={getFHIRResources}
              hasMore={this.hasMoreRecords()}
              loader={<div className="loader" key={0}>Loading ...</div>}
              useWindow={false}
            >
              {fhirData.map((r: any) => {
                return (
                  <div key={r.resource.id} className="row" onClick={onClick}>
                    <div className="row__logo">
                      <img src={this.returnProperhealthSystem(r.resource.identifier).logo}
                        alt="logo"
                      />
                      </div>
                    <div className="row__name">
                      <div className="row__name__icon">{this.returnHomeIcon()}</div>
                      <div>
                        {r.resource.name}
                        <span>{this.returnProperhealthSystem(r.resource.identifier).name}</span>
                      </div>
                    </div>
                    <div className="row__address">{r.resource.address[0].line[0]}</div>
                    <div className="row__city">{r.resource.address[0].city}</div>
                    <div className="row__state">{r.resource.address[0].state}</div>
                    <div className="row__zipcode">{r.resource.address[0].postalCode}</div>
                    <div className="row__action">Connect</div>
                  </div>
                );
              })}
              </InfiniteScroll>
            </div>
        </div>
      );
    }

    return <div>Loading...</div>;
  }
}

export default List;
