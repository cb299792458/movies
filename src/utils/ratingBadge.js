export function getRatingBadgeStyle(voteAverage) {
  const rating = Math.min(10, Math.max(0, voteAverage))
  const scale = (rating / 10) ** 1.35

  let backgroundColor = 'rgb(51 65 85 / 0.92)'
  let boxShadow = '0 1px 3px rgb(0 0 0 / 0.25)'

  if (rating >= 8) {
    backgroundColor = 'rgb(5 150 105 / 0.95)'
    boxShadow = '0 3px 14px rgb(16 185 129 / 0.6)'
  } else if (rating >= 7) {
    backgroundColor = 'rgb(217 119 6 / 0.95)'
    boxShadow = '0 2px 10px rgb(245 158 11 / 0.55)'
  } else if (rating >= 6) {
    backgroundColor = 'rgb(71 85 105 / 0.92)'
  }

  return {
    fontSize: `${0.6 + scale * 1.15}rem`,
    padding: `${0.2 + scale * 0.4}rem ${0.4 + scale * 0.85}rem`,
    backgroundColor,
    boxShadow,
    fontWeight: rating >= 7 ? 700 : 600,
    lineHeight: 1.1,
  }
}
