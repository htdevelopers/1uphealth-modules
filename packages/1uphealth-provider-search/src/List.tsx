import * as React from 'react';

interface Props {
  onClick: any;
}

class List extends React.Component<Props> {
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

  public render(): JSX.Element {
    const { onClick } = this.props;

    const data = [
      {
        logo: '-',
        name: 'Dr. Gorge Office',
        system: 'XYZ Health System',
        address: 'Baker Street 221B',
        city: 'New York',
        state: 'NY',
        zipcode: '10011',
        action: 'Connected',
      },
      {
        logo: '-',
        name: 'Sam Smith Medicine Health',
        system: 'ABC Health System',
        address: 'Baker Street 221B',
        city: 'New York',
        state: 'NY',
        zipcode: '10011',
        action: 'Connected',
      },
    ];
    return (
      <div className="list-container">
        <div className="list-container__wrapper">
          {data.map((r) => {
            return (
              <div className="row" onClick={onClick}>
                <div className="row__logo">{r.logo}</div>
                <div className="row__name">
                  <div className="row__name__icon">{this.returnHomeIcon()}</div>
                  <div>
                    {r.name}
                    <span>{r.system}</span>
                  </div>
                </div>
                <div className="row__address">{r.address}</div>
                <div className="row__city">{r.city}</div>
                <div className="row__state">{r.state}</div>
                <div className="row__zipcode">{r.zipcode}</div>
                <div className="row__action">{r.action}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default List;
