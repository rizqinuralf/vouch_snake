import { expect, Locator, Page } from '@playwright/test';

export class SnakeGamePage {
  readonly page: Page;
  readonly startGameButton: Locator;
  readonly pauseButton: Locator;
  readonly scoreDisplay: Locator;
  readonly gameOverMessage: Locator;
  readonly playAgainButton: Locator;
  readonly resetButton: Locator;
  readonly gameCanvas: Locator; // Added locator for the game canvas

  constructor(page: Page) {
    this.page = page;
    this.startGameButton = page.locator('#startBtn'); // Using ID for more specificity
    this.pauseButton = page.locator('#pauseBtn'); // Using ID for more specificity
    this.scoreDisplay = page.locator('#score');
    this.gameOverMessage = page.locator('#gameOver');
    this.playAgainButton = page.locator('#playAgainBtn'); // Assuming an ID for Play Again button
    this.resetButton = page.locator('#resetBtn'); // Assuming an ID for Reset button
    this.gameCanvas = page.locator('#gameCanvas'); // Assuming an ID for the canvas
  }

  async goto() {
    await this.page.goto('/');
  }

  async clickStartGameButton() {
    await this.startGameButton.click();
  }

  async clickPauseButton() {
    await this.pauseButton.click();
  }

  async clickPlayAgainButton() {
    await this.playAgainButton.click();
  }

  async clickResetButton() {
    await this.resetButton.click();
  }

  async getScore() {
    return await this.scoreDisplay.textContent();
  }

  async pressKey(key: string) {
    await this.page.keyboard.press(key);
  }

  async getSnakeHeadPosition() {
    return await this.page.evaluate(() => {
      const snake = (window as any).snakeGame.snake;
      return { x: snake[0].x, y: snake[0].y };
    });
  }

  async getFoodPosition() {
    return await this.page.evaluate(() => {
      const food = (window as any).snakeGame.food;
      return { x: food.x, y: food.y };
    });
  }

  async waitForGameOver() {
    await this.gameOverMessage.waitFor({ state: 'visible' });
  }

  async getSnakeDirection() {
    return await this.page.evaluate(() => {
      return (window as any).snakeGame.dx === 1 ? 'right' :
             (window as any).snakeGame.dx === -1 ? 'left' :
             (window as any).snakeGame.dy === 1 ? 'down' :
             (window as any).snakeGame.dy === -1 ? 'up' : '';
    });
  }

  async eatFoodAndGetScore(initialScore: string | null) {
    let currentScore = initialScore;
    let attempts = 0;
    const maxAttempts = 100; // Prevent infinite loop

    while (currentScore === initialScore && attempts < maxAttempts) {
      // Try to move towards the food. This is a simplified approach.
      // A more advanced approach would calculate the shortest path.
      const snakeHead = await this.getSnakeHeadPosition();
      const food = await this.getFoodPosition();

      if (food.x > snakeHead.x) {
        await this.pressKey('ArrowRight');
      } else if (food.x < snakeHead.x) {
        await this.pressKey('ArrowLeft');
      } else if (food.y > snakeHead.y) {
        await this.pressKey('ArrowDown');
      } else if (food.y < snakeHead.y) {
        await this.pressKey('ArrowUp');
      } else {
        // If snake is on food, it will eat it next tick
      }

      await this.page.waitForTimeout(100); // Wait for game tick
      currentScore = await this.getScore();
      attempts++;
    }
    return currentScore;
  }

  async growSnakeByEatingFood(count: number) {
    for (let i = 0; i < count; i++) {
      const initialScore = await this.getScore();
      await this.eatFoodAndGetScore(initialScore);
      const newScore = await this.getScore();
      expect(parseInt(newScore || '0')).toBeGreaterThan(parseInt(initialScore || '0'));
    }
  }

  // New helper method to get the game state (e.g., running, paused, game over)
  async getGameState() {
    return await this.page.evaluate(() => {
      return (window as any).snakeGame.isGameOver ? 'gameOver' :
        (window as any).snakeGame.isPaused ? 'paused' :
          'running';
    });
  }

  // New helper method to check if an element is visible
  async isElementVisible(locator: Locator) {
    return await locator.isVisible();
  }
}