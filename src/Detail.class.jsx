import React from "react";
import { useParams, useNavigate } from "react-router-dom";
// import useFetch from "./services/useFetch";
import { Fetch } from "./services/useFetch";
import Spinner from "./Spinner";
import PageNotFound from "./PageNotFound";
// import { useCart } from "./cartContext";
import { CartContext } from "./cartContext";

export default function DetailWrapper() {
  const { id } = useParams();
  return <Detail id={id} navigate={useNavigate()} />;
}

class Detail extends React.Component {
  state = {
    sku: "",
  };

  //TODO: display these product details
  render() {
    const { id, navigate } = this.props;
    const { sku } = this.state;

    return (
      // using a render prop to consume a hook directly into the class component
      // code below until the next comment
      // setting them up children, you have the render wrapped within the Fetch component.
      <CartContext.Consumer>
        {({ dispatch }) => {
          return (
            <Fetch url={`products/${id}`}>
              {(product, loading, error) => {
                if (loading) return <Spinner />;
                if (!product) return <PageNotFound />;
                if (error) throw error;
                // the above code is used to consume the render prop into a class component
                return (
                  <div id="detail">
                    <h1>{product.name}</h1>
                    <p>{product.description}</p>
                    <p id="price">${product.price}</p>
                    <select
                      id="size"
                      value={sku}
                      onChange={(e) => this.setState({ sku: e.target.value })}
                    >
                      <option value="">What size?</option>
                      {product.skus.map((s) => (
                        <option key={s.sku} value={s.sku}>
                          {s.size}
                        </option>
                      ))}
                    </select>
                    <p>
                      <button
                        onClick={() => {
                          this.context.dispatch({ type: "add", id, sku });
                          navigate("/cart");
                        }}
                        className="btn btn-primary"
                        disabled={!sku}
                      >
                        Add to Cart
                      </button>
                    </p>

                    <img
                      src={`/images/${product.image}`}
                      alt={product.category}
                    />
                  </div>
                );
              }}
            </Fetch>
          );
        }}
      </CartContext.Consumer>
    );
  }
}
