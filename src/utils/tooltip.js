const TOOLTIP_WIDTH = 288
const TOOLTIP_OFFSET = 12
const TOOLTIP_ESTIMATED_HEIGHT = 180

export function getTooltipPosition(clientX, clientY) {
  let x = clientX + TOOLTIP_OFFSET
  let y = clientY + TOOLTIP_OFFSET

  if (x + TOOLTIP_WIDTH > window.innerWidth - 8) {
    x = clientX - TOOLTIP_WIDTH - TOOLTIP_OFFSET
  }

  if (y + TOOLTIP_ESTIMATED_HEIGHT > window.innerHeight - 8) {
    y = clientY - TOOLTIP_ESTIMATED_HEIGHT - TOOLTIP_OFFSET
  }

  return {
    x: Math.max(8, x),
    y: Math.max(8, y),
  }
}
