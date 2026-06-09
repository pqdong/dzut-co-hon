import { useGameStore } from './store/useGameStore';
import { GlobalStyle, AppContainer } from './components/styled';
import { IntroScreen } from './screens/IntroScreen';
import { MissionScreen } from './screens/MissionScreen';
import { GameplayScreen } from './screens/GameplayScreen';
import { ResultScreen } from './screens/ResultScreen';
import styled from 'styled-components';

const AppOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  pointer-events: none;
  z-index: 0;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export default function App() {
  const { gameState } = useGameStore();

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <AppOverlay />
        <ContentWrapper>
          {gameState === 'intro' && <IntroScreen />}
          {gameState === 'mission' && <MissionScreen />}
          {gameState === 'playing' && <GameplayScreen />}
          {gameState === 'result' && <ResultScreen />}
        </ContentWrapper>
      </AppContainer>
    </>
  );
}

