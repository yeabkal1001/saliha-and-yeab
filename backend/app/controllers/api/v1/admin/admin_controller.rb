class Api::V1::Admin::AdminController < ApplicationController
  before_action :authenticate_user
  before_action :ensure_admin

  def dashboard
    @stats = {
      total_users: User.count,
      total_products: Product.count,
      total_orders: Order.count,
      total_revenue: Order.where(status: 'delivered').sum(:total_amount)
    }

    @recent_orders = Order.includes(:user, :order_items).order(created_at: :desc).limit(10)
    @recent_users = User.order(created_at: :desc).limit(10)
    @recent_products = Product.includes(:user).order(created_at: :desc).limit(10)

    render json: {
      stats: @stats,
      recent_orders: @recent_orders.as_json(include: { 
        user: { only: [:id, :name, :email] },
        order_items: { include: { product: { only: [:id, :title, :price] } } }
      }),
      recent_users: @recent_users.as_json(only: [:id, :name, :email, :store_name, :created_at]),
      recent_products: @recent_products.as_json(include: { user: { only: [:id, :name] } })
    }
  end

  def users
    @users = User.order(created_at: :desc)
    render json: @users.as_json(only: [:id, :name, :email, :store_name, :admin, :created_at])
  end

  def toggle_admin
    @user = User.find(params[:id])
    @user.update!(admin: !@user.admin)
    render json: @user.as_json(only: [:id, :name, :email, :admin])
  end

  def delete_user
    @user = User.find(params[:id])
    @user.destroy
    head :no_content
  end

  def products
    @products = Product.includes(:user).order(created_at: :desc)
    render json: @products.as_json(include: { user: { only: [:id, :name, :email] } })
  end

  def delete_product
    @product = Product.find(params[:id])
    @product.destroy
    head :no_content
  end

  def orders
    @orders = Order.includes(:user, :order_items).order(created_at: :desc)
    render json: @orders.as_json(include: { 
      user: { only: [:id, :name, :email] },
      order_items: { include: { product: { only: [:id, :title, :price] } } }
    })
  end

  private

  def ensure_admin
    unless @current_user&.admin?
      render json: { error: 'Admin access required' }, status: :forbidden
    end
  end
end 