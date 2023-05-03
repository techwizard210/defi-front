const Spinner = () => {
  return (
    <div className="hifi-loading">
      <div className="hifi-loading-circle hifi-loading-circle--activate">
        <div className="hifi-number">
          {/* <span className="hifi-num9">9</span>
                    <span className="hifi-num8">8</span>
                    <span className="hifi-num7">7</span>
                    <span className="hifi-num6">6</span> */}
          {/* <span className="hifi-num5">5</span>
                    <span className="hifi-num4">4</span> */}
          <span className="hifi-num3">3</span>
          <span className="hifi-num2">2</span>
          <span className="hifi-num1">1</span>
        </div>
      </div>
    </div>
  );
};

export default Spinner;
