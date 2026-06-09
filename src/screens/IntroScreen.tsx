import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { Title, Button, TopBar, SettingsIconsRow, IconButton, SubTitle, GhostMascot, Overlay, ModalBox } from '../components/styled';
import { Volume2, VolumeX, Vibrate, VibrateOff, Info, Coins } from 'lucide-react';
import { ASSETS } from '../constants/assets';
import styled from 'styled-components';

const IntroOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 40;
  padding: 24px;
  padding-top: 96px;
  pointer-events: none;
`;

const IntroModalBox = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: auto;
  position: relative;
  z-index: 50;
`;

const TopBarVipGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TopBarItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  padding: 8px 16px;
  backdrop-filter: blur(12px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const VipBadge = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  background-color: #facc15;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  font-weight: 700;
  font-size: 0.75rem;
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
`;

const VipText = styled.span`
  color: #ffffff;
  font-weight: 700;
  letter-spacing: 0.05em;
`;

const VipPointsText = styled.span`
  color: #facc15;
  font-size: 0.625rem;
  margin-left: 4px;
`;

const AddButton = styled.button`
  margin-left: 4px;
  width: 24px;
  height: 24px;
  border-radius: 9999px;
  background-color: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.125rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background-color: #60a5fa;
  }
`;

const TurnsLabel = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const TurnsValue = styled.span`
  color: #ffffff;
  font-weight: 700;
`;

const GuideButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  transition: color 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: 0.875rem;
  width: 100%;
  padding-top: 8px;
  padding-bottom: 8px;

  &:hover {
    color: #ffffff;
  }
`;

export const IntroScreen = () => {
  const { setGameState, soundSettings, toggleSound, toggleVibration, userTurns } = useGameStore();
  const [showGuide, setShowGuide] = useState(false);

  return (
    <>
      <TopBar>
        <TopBarVipGroup>
          <TopBarItem>
            <VipBadge>VIP</VipBadge>
            <VipText>12,500 <VipPointsText>POINTS</VipPointsText></VipText>
            <AddButton>+</AddButton>
          </TopBarItem>
          <TopBarItem>
            <TurnsLabel>Lượt chơi:</TurnsLabel>
            <TurnsValue>{String(userTurns).padStart(2, '0')}</TurnsValue>
          </TopBarItem>
        </TopBarVipGroup>

        <SettingsIconsRow>
          <IconButton onClick={toggleSound}>
            {soundSettings.sound ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </IconButton>
          <IconButton onClick={toggleVibration}>
            {soundSettings.vibration ? <Vibrate size={24} /> : <VibrateOff size={24} />}
          </IconButton>
        </SettingsIconsRow>
      </TopBar>
      
      <IntroOverlay>
        <IntroModalBox>
          <GhostMascot src={ASSETS.ghosts.rare} alt="Ghost Mascot" style={{ width: 128, height: 128 }} />
          <Title>DZỰT CÔ HỒN</Title>
          <SubTitle>Nhanh tay vuốt hồn ma để nhận quà khủng!</SubTitle>
          
          <Button 
            onClick={() => setGameState('playing')}
            disabled={userTurns <= 0}
            style={{ opacity: userTurns <= 0 ? 0.5 : 1 }}
          >
            {userTurns > 0 ? 'Dzựt Ngay' : 'Hết lượt'}
          </Button>
          
          <Button $variant="secondary" onClick={() => setGameState('mission')}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Coins size={20} />
              Kiếm thêm lượt
            </span>
          </Button>
          
          <GuideButton 
            onClick={() => setShowGuide(true)}
          >
            <Info size={18} /> Hướng dẫn
          </GuideButton>
        </IntroModalBox>
      </IntroOverlay>

      {showGuide && (
        <Overlay>
          <ModalBox>
            <h2 style={{ color: '#000', marginTop: 0, textTransform: 'uppercase', fontWeight: 900 }}>Hướng dẫn</h2>
            <p style={{ color: '#555', lineHeight: 1.5, fontWeight: 600 }}>Nhanh tay vuốt hồn ma vào giỏ trước khi hết giờ!<br/><br/>Lưu ý: Mỗi lần chỉ bắt 1 con.</p>
            <Button onClick={() => setShowGuide(false)} style={{ marginTop: 24 }}>Đã hiểu</Button>
          </ModalBox>
        </Overlay>
      )}
    </>
  );
};
