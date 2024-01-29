import { getCssValue } from './common.js';

export function getTransformPara(elem: HTMLElement) {
  // var elem = document.getElementById(id);
  var tr = getCssValue(elem, '-webkit-transform');
  if (tr != 'none') {
    var values = tr.split('(')[1].split(')')[0].split(',') as any;
    var a = values[0];
    var b = values[1];
    var c = values[2];
    var d = values[3];
    var e = values[4];
    var f = values[5];
    var scale1 = Math.sqrt(a * a + b * b);
    var scale2 = Math.sqrt(c * c + d * d);
    var angle = Math.atan2(b, a) * (180.0 / Math.PI);
    e = parseFloat(e);
    f = parseFloat(f);
    var radian = (-Math.PI / 180.0) * angle;
    var lastX = Math.cos(radian) * e - Math.sin(radian) * f;
    var LastY = Math.sin(radian) * e + Math.cos(radian) * f;
    return {
      ScaleX: scale1,
      ScaleY: scale2,
      Angle: angle,
      MovX: lastX,
      MovY: LastY
    };
  } else {
    return {
      ScaleX: 1,
      ScaleY: 1,
      Angle: 0,
      MovX: 0,
      MovY: 0
    };
  }
}
