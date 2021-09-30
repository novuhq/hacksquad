import { Avatar, Col, Row, Tooltip } from 'antd';
import { UserOutlined, AntDesignOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import capitalize from 'lodash.capitalize';

export function Leaderboard({ items }: { items: any[] }) {
  return (
    <>
      <LeaderBoardWrapper>
        {(items || []).map((item) => {
          return <ListingItem key={item._id} data={item} />;
        })}
      </LeaderBoardWrapper>
    </>
  );
}

function ListingItem({ data }: { data: any }) {
  return (
    <ItemWrapper>
      <AvatarWrapper style={{ maxWidth: '300px' }}>
        <PositionCount>#{data.position}</PositionCount>
        <Avatar
          shape="square"
          style={{ backgroundColor: data.squad.color || '#5C7AEA', minWidth: 40 }}
          size={40}
          src={data.logo}>
          {data.squad.name[0]}
        </Avatar>
        <span
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
          {capitalize(data.squad?.name)}
        </span>
      </AvatarWrapper>

      <div style={{ display: 'flex' }}>
        <StatsWrapper>
          <Tooltip title="Total squad accepted or merged pull requests">
            <span>
              <b>{data.commits} </b>
              PRS
            </span>
          </Tooltip>
          <Tooltip title="Lines of code added">
            <span>
              <b>{data.linesAdded} </b>
              LOCA
            </span>
          </Tooltip>
{' '}
          <Tooltip title="Lines of code removed">
            <span>
              <b>{data.linesRemoved} </b>
              LOCR
            </span>
          </Tooltip>
        </StatsWrapper>
        <div
          style={{ width: 150, textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Avatar.Group>
            {data.squad?.members.map((member) => {
              return (
                <Tooltip key={member._id} title={`${capitalize(member.firstName)}`} placement="top">
                  <a target="_blank" href={`https://github.com/${member.username}`}>
                    <Avatar
                      style={{ backgroundColor: '#87d068' }}
                      src={member.profilePicture}
                      icon={<UserOutlined />}
                    />
                  </a>
                </Tooltip>
              );
            })}
          </Avatar.Group>
        </div>
      </div>
    </ItemWrapper>
  );
}

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

const LeaderBoardWrapper = styled.div`
  margin-bottom: 100px;
`;
