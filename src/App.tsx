import { useState, useEffect } from 'react';
import styled, { ThemeProvider, createGlobalStyle, DefaultTheme } from 'styled-components';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend,
  ArcElement
);

const lightTheme: DefaultTheme = {
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  card: 'white',
  text: '#222',
  accent: '#4CAF50',
  buttonBg: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
  buttonText: 'white',
  inputBg: 'white',
  inputBorder: '#4CAF50',
};

const darkTheme: DefaultTheme = {
  background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
  card: '#232526',
  text: '#f5f7fa',
  accent: '#81c784',
  buttonBg: 'linear-gradient(135deg, #388e3c 0%, #43a047 100%)',
  buttonText: 'white',
  inputBg: '#232526',
  inputBorder: '#81c784',
};

const GlobalStyle = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    transition: background 0.3s, color 0.3s;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  
  html {
    overflow: hidden;
  }
  
  @media (max-width: 768px) {
    body {
      overflow: hidden;
      position: fixed;
      width: 100%;
      height: 100%;
    }
    
    html {
      overflow: hidden;
    }
  }
`;

const ThemeToggle = styled.button`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.buttonText};
  border: 2px solid ${({ theme }) => theme.accent};
  border-radius: 50%;
  padding: 0.5rem;
  font-size: 1.5rem;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2000;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  transition: background 0.2s, color 0.2s, border 0.2s;
  outline: none;
  &:hover {
    filter: brightness(1.1);
    border-width: 2.5px;
  }
`;

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme.background};
  font-family: 'Arial', sans-serif;
  color: ${({ theme }) => theme.text};
  overflow: hidden;
  
  @media (max-width: 768px) {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
`;

const GameArea = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  padding: 80px 20px 20px 20px; /* Safe zone for UI elements */
  
  @media (max-width: 768px) {
    padding: 100px 10px 10px 10px;
  }
`;

const Shape = styled.div<{ x: number; y: number; size: number; color: string; shape: string }>`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-color: ${props => props.color};
  border-radius: ${props => {
    switch (props.shape) {
      case 'circle': return '50%';
      case 'triangle': return '0';
      case 'star': return '0';
      default: return '0';
    }
  }};
  clip-path: ${props => {
    switch (props.shape) {
      case 'triangle': return 'polygon(50% 0%, 0% 100%, 100% 100%)';
      case 'star': return 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
      default: return 'none';
    }
  }};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  user-select: none;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @media (max-width: 768px) {
    font-size: 18px;
    min-width: 44px;
    min-height: 44px;
  }
`;

const Score = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  font-size: 24px;
  font-weight: bold;
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  padding: 10px 20px;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1000;
  border: 2px solid ${({ theme }) => theme.accent};
  
  @media (max-width: 768px) {
    font-size: 18px;
    padding: 8px 16px;
    top: 15px;
    right: 15px;
  }
`;

const Timer = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  font-size: 24px;
  font-weight: bold;
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  padding: 10px 20px;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1000;
  border: 2px solid ${({ theme }) => theme.accent};
  
  @media (max-width: 768px) {
    font-size: 18px;
    padding: 8px 16px;
    top: 15px;
    left: 15px;
  }
`;

const StartScreen = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${({ theme }) => theme.card};
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  text-align: center;
  min-width: 300px;
  max-width: 500px;
  color: ${({ theme }) => theme.text};
  
  @media (max-width: 768px) {
    min-width: 280px;
    max-width: 90vw;
    padding: 1.5rem;
    margin: 20px;
    width: calc(100vw - 40px);
    max-height: 90vh;
    overflow-y: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  color: ${({ theme }) => theme.accent};
  margin-bottom: 1rem;
  font-weight: bold;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Button = styled.button`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.buttonText};
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  width: 80%;
  min-height: 44px;
  touch-action: manipulation;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0,0,0,0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.8rem 1.5rem;
    min-height: 48px;
  }
`;

const Select = styled.select`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 2px solid ${({ theme }) => theme.inputBorder};
  border-radius: 5px;
  margin: 0.5rem;
  cursor: pointer;
  width: 80%;
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
  min-height: 44px;
  
  @media (max-width: 768px) {
    font-size: 16px; /* Prevents zoom on iOS */
    min-height: 48px;
  }
`;

const Label = styled.label`
  display: block;
  margin: 0.5rem 0;
  font-weight: bold;
  color: #333;
`;

const InstructionsButton = styled.button`
  background: none;
  border: none;
  color: #4CAF50;
  text-decoration: underline;
  cursor: pointer;
  font-size: 1rem;
  margin: 1rem 0;
  padding: 0.5rem;
`;

const InstructionsModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  max-width: 500px;
  z-index: 1000;
  
  @media (max-width: 768px) {
    width: calc(100vw - 40px);
    max-width: 90vw;
    max-height: 90vh;
    overflow-y: auto;
    padding: 1.5rem;
  }
`;

const StatsScreen = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  text-align: center;
  min-width: 300px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (max-width: 768px) {
    width: calc(100vw - 40px);
    max-width: 90vw;
    max-height: 90vh;
    padding: 1.5rem;
    gap: 0.8rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`;

const StatItem = styled.div`
  margin: 0.5rem 0;
  padding: 1rem;
  background: ${({ theme }) => theme.card};
  border-radius: 10px;
  min-width: 150px;
  color: ${({ theme }) => theme.text};
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
`;

const ChartContainer = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background: ${({ theme }) => theme.card};
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  color: ${({ theme }) => theme.text};
`;

const CenteredButton = styled(Button)`
  display: block;
  margin: 2rem auto 0 auto;
  width: 300px;
  max-width: 90vw;
`;

const ExitButton = styled.button`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.buttonText};
  border: 2px solid ${({ theme }) => theme.accent};
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
  outline: none;
  
  &:hover {
    transform: translateX(-50%) translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    filter: brightness(1.1);
  }
`;

interface GameSettings {
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  infiniteMode: boolean;
}

interface GameStats {
  totalShapes: number;
  accuracy: number;
  averageTimePerShape: number;
  difficulty: string;
  timeLimit: number;
  shapeTypes: {
    circle: number;
    square: number;
    triangle: number;
    star: number;
  };
  timeData: number[];
}

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameStats, setGameStats] = useState<GameStats>({
    totalShapes: 0,
    accuracy: 0,
    averageTimePerShape: 0,
    difficulty: 'easy',
    timeLimit: 60,
    shapeTypes: {
      circle: 0,
      square: 0,
      triangle: 0,
      star: 0
    },
    timeData: []
  });
  const [settings, setSettings] = useState<GameSettings>({
    difficulty: 'easy',
    timeLimit: 60,
    infiniteMode: false
  });
  const [currentShape, setCurrentShape] = useState({
    x: 0,
    y: 0,
    size: 100,
    color: '#FF5733',
    shape: 'circle'
  });
  const [customTime, setCustomTime] = useState<string>('');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  const shapes = ['circle', 'square', 'triangle', 'star'];
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3', '#33FFF3'];

  useEffect(() => {
    let timer: number;
    if (gameStarted && timeLeft > 0 && !settings.infiniteMode) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !settings.infiniteMode) {
      setGameStarted(false);
      setShowStats(true);
    }
    return () => clearInterval(timer);
  }, [gameStarted, timeLeft, settings.infiniteMode]);

  useEffect(() => {
    let timer: number;
    if (gameStarted && settings.infiniteMode) {
      timer = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, settings.infiniteMode]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(settings.timeLimit);
    setScore(0);
    setElapsedTime(0);
    setGameStats({
      totalShapes: 0,
      accuracy: 0,
      averageTimePerShape: 0,
      difficulty: settings.difficulty,
      timeLimit: settings.timeLimit,
      shapeTypes: {
        circle: 0,
        square: 0,
        triangle: 0,
        star: 0
      },
      timeData: []
    });
    generateNewShape();
  };

  const generateNewShape = () => {
    const maxX = window.innerWidth - 200; // Account for padding
    const maxY = window.innerHeight - 200; // Account for padding
    
    // Ensure minimum values for mobile
    const safeMaxX = Math.max(maxX, 100);
    const safeMaxY = Math.max(maxY, 100);
    
    const x = Math.random() * safeMaxX;
    const y = Math.random() * safeMaxY;
    
    let size = 100;
    switch (settings.difficulty) {
      case 'easy': size = 100; break;
      case 'medium': size = 75; break;
      case 'hard': size = 50; break;
    }
    
    // Ensure minimum size for mobile touch targets
    if (window.innerWidth <= 768) {
      size = Math.max(size, 44);
    }
    
    setCurrentShape({
      x,
      y,
      size,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)]
    });
  };

  const handleShapeClick = () => {
    setScore(prev => prev + 1);
    setGameStats(prev => {
      const newShapeTypes = { ...prev.shapeTypes };
      newShapeTypes[currentShape.shape as keyof typeof newShapeTypes]++;
      
      const currentTime = settings.infiniteMode ? elapsedTime : settings.timeLimit - timeLeft;
      const newTimeData = [...prev.timeData, currentTime];
      
      return {
        ...prev,
        totalShapes: prev.totalShapes + 1,
        averageTimePerShape: currentTime / (prev.totalShapes + 1),
        shapeTypes: newShapeTypes,
        timeData: newTimeData
      };
    });
    generateNewShape();
  };

  const resetGame = () => {
    setShowStats(false);
    setGameStarted(false);
    setScore(0);
    setTimeLeft(settings.timeLimit);
    setElapsedTime(0);
  };

  const exitGame = () => {
    setGameStarted(false);
    setShowStats(true);
  };

  // Only show theme toggle on start, stats, or instructions screens
  const showThemeToggle = !gameStarted || showStats || showInstructions;

  if (showStats) {
    const isDark = theme === 'dark';
    const timeChartData = {
      labels: gameStats.timeData.map((_, index) => `Shape ${index + 1}`),
      datasets: [
        {
          label: 'Time per Shape (seconds)',
          data: gameStats.timeData,
          borderColor: isDark ? '#81c784' : '#4CAF50',
          backgroundColor: isDark ? 'rgba(129, 199, 132, 0.1)' : 'rgba(76, 175, 80, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };

    const shapeChartData = {
      labels: ['Circle', 'Square', 'Triangle', 'Star'],
      datasets: [
        {
          data: [
            gameStats.shapeTypes.circle,
            gameStats.shapeTypes.square,
            gameStats.shapeTypes.triangle,
            gameStats.shapeTypes.star
          ],
          backgroundColor: [
            isDark ? '#ffb74d' : '#FF5733',
            isDark ? '#81c784' : '#33FF57',
            isDark ? '#64b5f6' : '#3357FF',
            isDark ? '#fff176' : '#F3FF33'
          ],
          borderWidth: 1
        }
      ]
    };

    const chartTextColor = isDark ? '#f5f7fa' : '#222';
    const chartGridColor = isDark ? '#555' : '#ccc';

    return (
      <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
        <GlobalStyle />
        {showThemeToggle && (
          <ThemeToggle onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} aria-label="Toggle dark/light mode">
            {theme === 'dark' ? '☀️' : '🌙'}
          </ThemeToggle>
        )}
        <StatsScreen>
          <Title>Game Stats</Title>
          <StatsGrid>
            <StatItem>
              <h3>Total Score</h3>
              <p>{score}</p>
            </StatItem>
            <StatItem>
              <h3>Shapes Clicked</h3>
              <p>{gameStats.totalShapes}</p>
            </StatItem>
            <StatItem>
              <h3>Average Time per Shape</h3>
              <p>{gameStats.averageTimePerShape.toFixed(2)} seconds</p>
            </StatItem>
            <StatItem>
              <h3>Difficulty</h3>
              <p>{settings.difficulty}</p>
            </StatItem>
            <StatItem>
              <h3>Game Mode</h3>
              <p>{settings.infiniteMode ? 'Infinite Mode' : `${settings.timeLimit} seconds`}</p>
            </StatItem>
          </StatsGrid>

          <ChartContainer>
            <h3 style={{ color: chartTextColor }}>Time per Shape</h3>
            <Line
              data={timeChartData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                    labels: { color: chartTextColor }
                  },
                  title: {
                    display: true,
                    text: 'Time Taken for Each Shape',
                    color: chartTextColor
                  }
                },
                scales: {
                  x: {
                    ticks: { color: chartTextColor },
                    grid: { color: chartGridColor }
                  },
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Seconds',
                      color: chartTextColor
                    },
                    ticks: { color: chartTextColor },
                    grid: { color: chartGridColor }
                  }
                }
              }}
            />
          </ChartContainer>

          <ChartContainer>
            <h3 style={{ color: chartTextColor }}>Shape Distribution</h3>
            <Doughnut
              data={shapeChartData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                    labels: { color: chartTextColor }
                  },
                  title: {
                    display: true,
                    text: 'Types of Shapes Clicked',
                    color: chartTextColor
                  }
                }
              }}
            />
          </ChartContainer>

          <CenteredButton onClick={resetGame}>Play Again</CenteredButton>
        </StatsScreen>
      </ThemeProvider>
    );
  }

  if (showInstructions) {
    return (
      <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
        <GlobalStyle />
        {showThemeToggle && (
          <ThemeToggle onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} aria-label="Toggle dark/light mode">
            {theme === 'dark' ? '☀️' : '🌙'}
          </ThemeToggle>
        )}
        <InstructionsModal>
          <h2>How to Play</h2>
          <p>1. Click the "Start Game" button to begin</p>
          <p>2. Click the shapes as they appear on the screen</p>
          <p>3. Try to click as many shapes as possible before time runs out</p>
          <p>4. Choose your difficulty level:</p>
          <ul>
            <li>Easy: Large shapes</li>
            <li>Medium: Medium shapes</li>
            <li>Hard: Small shapes</li>
          </ul>
          <Button onClick={() => setShowInstructions(false)}>Got it!</Button>
        </InstructionsModal>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      <GlobalStyle />
      {showThemeToggle && (
        <ThemeToggle onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} aria-label="Toggle dark/light mode">
          {theme === 'dark' ? '☀️' : '🌙'}
        </ThemeToggle>
      )}
      <AppContainer>
        {!gameStarted ? (
          <StartScreen>
            <Title>motor sQills</Title>
            <InstructionsButton onClick={() => setShowInstructions(true)}>
              How to Play
            </InstructionsButton>
            
            <Label>Difficulty Level:</Label>
            <Select
              value={settings.difficulty}
              onChange={(e) => setSettings(prev => ({ ...prev, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Select>

            <Label>Time Limit (seconds):</Label>
            <Select
              value={customTime !== '' ? 'custom' : settings.timeLimit}
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  setCustomTime(settings.timeLimit.toString());
                } else {
                  setCustomTime('');
                  setSettings(prev => ({ ...prev, timeLimit: Number(e.target.value) }));
                }
              }}
              disabled={settings.infiniteMode}
            >
              <option value={30}>30 seconds</option>
              <option value={60}>1 minute</option>
              <option value={120}>2 minutes</option>
              <option value={300}>5 minutes</option>
              <option value="custom">Custom...</option>
            </Select>
            {customTime !== '' && !settings.infiniteMode && (
              <div style={{ margin: '0.5rem 0' }}>
                <input
                  type="number"
                  min={5}
                  max={3600}
                  value={customTime}
                  onChange={e => {
                    const val = e.target.value;
                    setCustomTime(val);
                    setSettings(prev => ({ ...prev, timeLimit: Number(val) }));
                  }}
                  style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: 5, border: '1px solid #4CAF50', width: 120 }}
                /> seconds
              </div>
            )}

            <div style={{ margin: '1rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id="infiniteMode"
                checked={settings.infiniteMode}
                onChange={(e) => {
                  setSettings(prev => ({ ...prev, infiniteMode: e.target.checked }));
                  if (e.target.checked) {
                    setCustomTime('');
                  }
                }}
                style={{ width: '18px', height: '18px' }}
              />
              <Label htmlFor="infiniteMode" style={{ margin: 0, cursor: 'pointer' }}>
                Infinite Mode (no time limit)
              </Label>
            </div>

            <CenteredButton onClick={startGame}>Start Game</CenteredButton>
          </StartScreen>
        ) : (
          <>
            {settings.infiniteMode && (
              <ExitButton onClick={exitGame}>Exit Game</ExitButton>
            )}
            <Timer>Time: {settings.infiniteMode ? '∞' : `${timeLeft}s`}</Timer>
            <Score>Score: {score}</Score>
            <GameArea>
              <Shape
                x={currentShape.x}
                y={currentShape.y}
                size={currentShape.size}
                color={currentShape.color}
                shape={currentShape.shape}
                onClick={handleShapeClick}
              />
            </GameArea>
          </>
        )}
      </AppContainer>
    </ThemeProvider>
  );
}

export default App; 