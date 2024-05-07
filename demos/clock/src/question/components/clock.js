import * as d3 from 'd3'
import {
  drawCircle,
  drawTick,
  drawText,
  drawArrow,
  drawHand
} from '../utils/shapeDrawers.js'
import { numberPoints } from '../utils/pointFinders.js'
import {
  VIEW_BOX_SQUARE,
  CLOCK_CENTER,
  CLOCK_RADIUS,
  SMALL_HAND_RADIUS,
  BIG_HAND_RADIUS,
  Y1_OFFSET,
  Y2_OFFSET,
  NUMBER_Y_OFFSET,
  RANGE,
  MINUTE_TICK_LENGTH,
  MINUTES_IN_HOUR
} from '../constants.js'

export default class Clock {
  constructor(svg, { question, response }) {
    this.svg = svg
    this.question = question
    this.response = response
  }

  render() {
    this.setupClock()
    this.drawFace()
    this.drawText()
    this.initHands()
    this.drawArrows()
    this.drawAnchor()
  }

  setupClock() {
    d3.select(this.svg)
      .attr('viewBox', [0, 0, VIEW_BOX_SQUARE, VIEW_BOX_SQUARE])
      .attr('width', VIEW_BOX_SQUARE)
      .attr('height', VIEW_BOX_SQUARE)
  }
  drawFace() {
    drawCircle(this.svg, CLOCK_RADIUS, 'face')
  }
  drawAnchor() {
    drawCircle(this.svg, 10, 'anchor')
  }
  drawText() {
    // loop so we can:
    for (let i = 0; i < RANGE; i++) {
      // draw the ticks
      drawTick(
        this.svg,
        CLOCK_CENTER,
        Y1_OFFSET - MINUTE_TICK_LENGTH,
        CLOCK_CENTER,
        Y2_OFFSET,
        `tick tick-${i === 0 ? RANGE : i}`
      ).attr('transform', `rotate(${i * 30},${CLOCK_CENTER},${CLOCK_CENTER})`)
      // draw the numbers
      drawText(
        this.svg,
        CLOCK_CENTER,
        NUMBER_Y_OFFSET,
        `${i === 0 ? RANGE : i}`,
        `hour hour-${i === 0 ? RANGE : i}`
      )
        .attr(
          'transform',
          `translate(${numberPoints(i).x}, ${numberPoints(i).y})`
        )
        .attr('text-anchor', 'middle')
    }

    for (let i = 0; i < MINUTES_IN_HOUR; i++) {
      // Skip drawing for every 5th minute and for the 60th minute, which corresponds to the hour ticks
      if (i % 5 === 0) continue

      // Draw the minute tick
      drawTick(
        this.svg,
        CLOCK_CENTER,
        Y1_OFFSET - MINUTE_TICK_LENGTH, // Minute ticks will be shorter
        CLOCK_CENTER,
        Y2_OFFSET,
        `tick minute-tick-${i}`
      ).attr('transform', `rotate(${i * 6},${CLOCK_CENTER},${CLOCK_CENTER})`)
    }
  }
  initHands() {
    // set the clock hands to 10:10
    const hourHand = drawHand(
      this.svg,
      SMALL_HAND_RADIUS,
      210,
      'hand',
      this.question.response_id
    ).attr('data-angle', 210)

    const minHand = drawHand(
      this.svg,
      BIG_HAND_RADIUS,
      330,
      'hand',
      this.question.response_id
    ).attr('data-angle', 330)

    this.hourHand = hourHand
    this.minHand = minHand
  }
  drawArrows() {
    drawArrow(this.svg, this.question.response_id)
  }
}
