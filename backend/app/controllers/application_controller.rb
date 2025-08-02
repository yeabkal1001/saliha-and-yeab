class ApplicationController < ActionController::API
  # Remove the global before_action - let individual controllers decide
  # before_action :authenticate_user
  
  private
  
  def authenticate_user
    header = request.headers['Authorization']
    @current_user = nil
    return @current_user unless header
    
    token = header.split(' ').last
    return @current_user unless token
    
    begin
      decoded = JWT.decode(token, 'your-secret-key-here')[0]
      @current_user = User.find(decoded['user_id'])
    rescue ActiveRecord::RecordNotFound => e
      @current_user = nil
    rescue JWT::DecodeError => e
      @current_user = nil
    end
    
    @current_user
  end
  
  def current_user
    @current_user
  end

  def require_authentication
    authenticate_user
    unless @current_user
      render json: { error: 'Authentication required' }, status: :unauthorized
    end
  end
end 