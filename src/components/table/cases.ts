/** 1
 * >1 moving
 * >2
 * >3 hover
 * =======
 * >2
 * >3
 *  >1 (child)
 */

/** (after = true) 2
 * >1
 *  >2 moving
 *  >3 hover
 * =======
 * >1
 *  >3
 *  >2
 */


/** (after = true) 3
 * >1
 *  >2 moving
 * >3
 *  >4 hover
 *  >5
 * =======
 * >1
 * >3
 *  >4
 *  >2
 *  >5
 */


/** (after = true) 4
 * >1
 *  >2 moving
 *  >3
 * >4 hover
 * =======
 *
 * >1
 *  >3
 * >4
 * >2
 */


/** (after = false)5
 * >1 moving
 * >2
 *  >3 hover
 * =======
 * >2
 *  >1
 *  >3
 */

/** (after = false)6
 * >1 moving
 * >2
 * >3 hover
 * =======
 * >2
 * >1
 * >3
 */
