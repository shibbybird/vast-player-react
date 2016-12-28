
export const getTracking = (trackingName, tracking) => (
  (tracking || []).filter((value) => (
    value.getAttr('event') === trackingName
  )).map((value) => (value.getValue()))
);
