import { Avatar, Col, Row, Tooltip } from 'antd';
import { UserOutlined, AntDesignOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import capitalize from 'lodash.capitalize';

export function Contributions({ items }: { items: any[] }) {
  return (
    <>
      <ContributionsWrapper>
        {(items || []).map((item) => {
          return <ContributionItem key={item._id} data={item} />;
        })}
      </ContributionsWrapper>
    </>
  );
}

function ContributionItem({ data }: { data: any }) {
  return (
    <ItemWrapper>
      <AvatarWrapper style={{ maxWidth: '300px' }}>
        <Avatar shape="square" style={{ minWidth: 40 }} size={40} src={data?.raw?.pr?.user?.avatar_url}>
          {data?.raw?.pr?.user?.login}
        </Avatar>
        <span
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
          {capitalize(data.title)}
        </span>
      </AvatarWrapper>

      <RightRowWrapper style={{ display: 'flex' }}>
        <StatsWrapper>
          <Tooltip title="Lines of code added">
            <span>
              <b>{data.additions} </b>
              LOCA
            </span>
          </Tooltip>
{' '}
          <Tooltip title="Lines of code removed">
            <span>
              <b>{data.deletions} </b>
              LOCR
            </span>
          </Tooltip>
        </StatsWrapper>
      </RightRowWrapper>
    </ItemWrapper>
  );
}

const AvatarGroupWrapper = styled.div`
  @media screen and (max-width: 1024px) {
    display: none !important;
  }
`;

const RightRowWrapper = styled.div`
  @media screen and (max-width: 1024px) {
    display: block !important;
    line-height: 38px;
  }
`;

const StatsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 10px;
  font-weight: normal;

  span {
    padding: 0 5px;

    b {
      font-size: 12px;
    }
  }
`;

const PositionCount = styled.div`
  font-weight: bold;
  color: #5e5e5e;
  margin-left: 10px;
`;

const AvatarWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: normal;
  > span {
    margin-left: 15px;
  }
`;

const ItemWrapper = styled.div`
  background: #eeeeee;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
  color: black;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
`;

const ContributionsWrapper = styled.div`
  margin-bottom: 100px;
`;
