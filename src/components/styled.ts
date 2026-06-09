import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { ASSETS } from '../constants/assets';

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    overflow: hidden; /* Prevent scrolling */
    background-color: #1a0b2e;
    overscroll-behavior: none;
    -webkit-user-select: none;
    user-select: none;
    touch-action: none;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  }
`;

export const AppContainer = styled.div`
  width: 100%;
  height: 100dvh;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  user-select: none;
  background-image: url(${ASSETS.bg});
  background-size: cover;
  background-position: center;
  background-color: #1a0b2e;
  
  @media (min-width: 768px) {
    max-width: 480px;
    margin: 0 auto;
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  }
`;

export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
`;

export const ModalBox = styled.div`
  background-color: #ffffff;
  border-radius: 40px;
  width: 85%;
  max-width: 400px;
  padding: 32px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

export const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  width: 100%;
  padding-top: 16px;
  padding-bottom: 16px;
  font-weight: 900;
  border-radius: 16px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  margin-top: 16px;
  border: none;

  &:active {
    transform: scale(0.95);
  }

  ${(props) =>
    props.$variant === 'secondary'
      ? `
        background-color: rgba(0, 0, 0, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #ffffff;
        backdrop-filter: blur(12px);
      `
      : `
        background-color: #2563eb;
        color: #ffffff;
        box-shadow: 0 10px 15px -3px rgba(30, 58, 138, 0.5), 0 4px 6px -2px rgba(30, 58, 138, 0.5);
      `}
`;

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

export const GhostMascot = styled.img`
  width: 192px;
  height: 192px;
  object-fit: contain;
  filter: drop-shadow(0 25px 25px rgba(0, 0, 0, 0.5));
  z-index: 20;
  margin-bottom: 24px;
  animation: ${float} 4s ease-in-out infinite;
`;

export const Title = styled.h1`
  background-color: #dc2626;
  padding: 8px 32px;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  border-left: 1px solid #f87171;
  border-right: 1px solid #f87171;
  border-bottom: 1px solid #f87171;
  box-shadow: 0 10px 15px -3px rgba(127, 29, 29, 0.5), 0 4px 6px -2px rgba(127, 29, 29, 0.5);
  color: #ffffff;
  font-weight: 900;
  font-size: 2.25rem;
  line-height: 2.5rem;
  letter-spacing: -0.05em;
  margin: 0;
  margin-bottom: 16px;
  display: inline-block;
  text-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
`;

export const SubTitle = styled.h2`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
  margin-bottom: 24px;
`;

export const TopBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 50;
  pointer-events: none;
  
  > * {
    pointer-events: auto;
  }
`;

export const TurnsBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  padding: 8px 16px;
  backdrop-filter: blur(12px);
  color: #ffffff;
  font-weight: 700;
  letter-spacing: 0.05em;
  font-size: 0.875rem;
  line-height: 1.25rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

export const SettingsIconsRow = styled.div`
  display: flex;
  gap: 12px;
`;

export const IconButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  backdrop-filter: blur(12px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;

  &:active {
    transform: scale(0.95);
  }
`;

