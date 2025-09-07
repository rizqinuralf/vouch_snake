# Page snapshot

```yaml
- generic [ref=e2]:
  - heading "Snake Game" [level=1] [ref=e3]
  - generic [ref=e4]:
    - generic [ref=e5]:
      - text: "Score:"
      - generic [ref=e6]: "0"
    - generic [ref=e7]:
      - text: "High Score:"
      - generic [ref=e8]: "0"
  - generic [ref=e10]:
    - button "Start Game" [ref=e11] [cursor=pointer]
    - button "Pause" [disabled] [ref=e12]
    - button "Reset" [ref=e13] [cursor=pointer]
  - generic [ref=e14]:
    - heading "How to Play:" [level=3] [ref=e15]
    - paragraph [ref=e16]: Use arrow keys or WASD to control the snake
    - paragraph [ref=e17]: Eat the red food to grow and increase your score
    - paragraph [ref=e18]: Avoid hitting walls and your own tail!
```