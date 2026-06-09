import { useGameStore } from '../store/useGameStore';
import { Overlay, ModalBox, Button, GhostMascot } from '../components/styled';
import { ASSETS } from '../constants/assets';
import styled from 'styled-components';

const ResultMascotWrapper = styled.div`
  margin-top: -96px;
  margin-bottom: 16px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const ResultMascot = styled(GhostMascot)`
  width: 160px;
  height: 160px;
  margin: 0 auto;
`;

const ResultTitleText = styled.h2`
  color: #111827;
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 4px;
  letter-spacing: -0.025em;
  margin: 0;
  margin-top: 16px;
`;

const ResultGhostTier = styled.p`
  color: #2563eb;
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.75rem;
  margin-bottom: 16px;
  margin: 0;
  text-transform: uppercase;
  margin-top: 4px;
`;

const RewardBox = styled.div`
  background-color: #eff6ff;
  border: 2px dashed #bfdbfe;
  border-radius: 24px;
  padding: 24px;
  width: 100%;
  margin-bottom: 24px;
  margin-top: 16px;
  box-sizing: border-box;
`;

const RewardLabel = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  margin: 0;
`;

const RewardTitle = styled.p`
  color: #111827;
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 900;
  margin-top: 8px;
  margin-bottom: 4px;
  text-transform: uppercase;
  margin: 0;
`;

const RewardSubtitle = styled.p`
  color: #3b82f6;
  font-size: 0.625rem;
  font-weight: 700;
  margin-top: 4px;
  text-transform: uppercase;
  margin: 0;
`;

export const ResultScreen = () => {
  const { reward, caughtGhost, setGameState } = useGameStore();

  return (
    <Overlay>
      <ModalBox>
        <ResultMascotWrapper>
          <ResultMascot 
            src={caughtGhost ? ASSETS.ghosts[caughtGhost.tier] : ASSETS.ghosts.common} 
          />
        </ResultMascotWrapper>
        <ResultTitleText>BẠN ĐÃ BẮT ĐƯỢC!</ResultTitleText>
        <ResultGhostTier>GHOST {caughtGhost?.tier || 'COMMON'}</ResultGhostTier>
        
        <RewardBox>
          <RewardLabel>QUÀ TẶNG CỦA BẠN</RewardLabel>
          <RewardTitle>
            {reward?.name || 'Không có quà'}
          </RewardTitle>
          <RewardSubtitle>Đã thêm vào kho quà tặng</RewardSubtitle>
        </RewardBox>

        <Button onClick={() => setGameState('intro')} style={{ marginTop: 0 }}>
          Chơi tiếp
        </Button>
      </ModalBox>
    </Overlay>
  );
};
