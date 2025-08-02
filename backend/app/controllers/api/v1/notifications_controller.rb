class Api::V1::NotificationsController < ApplicationController
  before_action :authenticate_user

  def index
    @notifications = @current_user.notifications.order(created_at: :desc)
    render json: @notifications
  end

  def mark_as_read
    @notification = @current_user.notifications.find(params[:id])
    @notification.update!(read: true)
    render json: @notification
  end

  def mark_all_as_read
    @current_user.notifications.update_all(read: true)
    render json: { message: 'All notifications marked as read' }
  end

  def destroy
    @notification = @current_user.notifications.find(params[:id])
    @notification.destroy
    head :no_content
  end

  def clear_all
    @current_user.notifications.destroy_all
    render json: { message: 'All notifications cleared' }
  end
end 