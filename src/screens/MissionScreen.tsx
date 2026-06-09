import { useGameStore } from '../store/useGameStore';
import { Overlay, ModalBox, Button } from '../components/styled';
import styled from 'styled-components';

const MissionModalBox = styled(ModalBox)`
  background-color: rgba(0, 0, 0, 0.8) !important;
  backdrop-filter: blur(24px) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 24px !important;
  padding: 24px !important;
  max-width: 340px !important;
`;

const MissionHeader = styled.h3`
  color: #ffffff;
  font-weight: 700;
  font-size: 1.125rem;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 16px;
  width: 100%;
  margin-top: 0;
`;

const MissionHeaderIcon = styled.span`
  width: 8px;
  height: 24px;
  background-color: #facc15;
  border-radius: 9999px;
`;

const MissionList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MissionItem = styled.div`
  background-color: rgba(255, 255, 255, 0.05);
  padding: 12px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const MissionItemCol = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const MissionItemTitle = styled.span`
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 600;
`;

const MissionItemReward = styled.span`
  color: #facc15;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  text-transform: uppercase;
  margin: 0;
`;

const MissionItemButton = styled.button`
  padding: 8px 16px;
  background-color: #facc15;
  color: #000000;
  font-size: 0.625rem;
  font-weight: 900;
  border-radius: 9999px;
  cursor: pointer;
  transition: background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;

  &:hover {
    background-color: #fde047;
  }
`;

const VipMissionItem = styled.div`
  margin-top: 16px;
  background: linear-gradient(to right, #2563eb, #4f46e5);
  padding: 16px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 10px 15px -3px rgba(30, 58, 138, 0.5), 0 4px 6px -2px rgba(30, 58, 138, 0.5);
`;

const VipMissionTitle = styled.span`
  color: #ffffff;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  opacity: 0.8;
  margin: 0;
`;

const VipMissionDesc = styled.span`
  color: #ffffff;
  font-size: 0.6875rem;
  font-weight: 500;
  margin: 0;
`;

const VipMissionButton = styled.button`
  background-color: #ffffff;
  color: #2563eb;
  padding: 8px 16px;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: 900;
  cursor: pointer;
  transition: background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;

  &:hover {
    background-color: #f3f4f6;
  }
`;

export const MissionScreen = () => {
  const { setGameState, addTurns } = useGameStore();

  const handleEarnTurn = () => {
    addTurns(1);
    alert('Nhận thành công 1 lượt!');
  };

  return (
    <Overlay>
      <MissionModalBox>
        <MissionHeader>
          <MissionHeaderIcon />
          Nhiệm vụ kiếm lượt
        </MissionHeader>
        
        <MissionList>
          <MissionItem>
            <MissionItemCol>
              <MissionItemTitle>Điểm danh mỗi ngày</MissionItemTitle>
              <MissionItemReward>+1 Lượt chơi</MissionItemReward>
            </MissionItemCol>
            <MissionItemButton onClick={handleEarnTurn}>NHẬN</MissionItemButton>
          </MissionItem>
          
          <VipMissionItem>
            <MissionItemCol>
              <VipMissionTitle>Đổi điểm VIP</VipMissionTitle>
              <VipMissionDesc>500 pts = 1 Lượt</VipMissionDesc>
            </MissionItemCol>
            <VipMissionButton onClick={handleEarnTurn}>ĐỔI NGAY</VipMissionButton>
          </VipMissionItem>
        </MissionList>

        <Button $variant="secondary" style={{ marginTop: 24 }} onClick={() => setGameState('intro')}>
          Quay lại
        </Button>
      </MissionModalBox>
    </Overlay>
  );
};
