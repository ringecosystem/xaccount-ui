export enum MsgPort {
  ORMP_U = 'ORMP-U',
  Multi = 'Multi'
}

export const MSG_PORT_OPTIONS = new Map<MsgPort, string>([
  [MsgPort.ORMP_U, 'ORMP-U'],
  [MsgPort.Multi, 'Multi']
]);
