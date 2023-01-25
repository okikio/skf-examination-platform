from flask import request
  from flask_restplus import Resource
  from skf.api.security import security_headers, select_userid_jwt, validate_privilege
from skf.api.labs.business import deploy_labs
  from skf.api.labs.serializers import lab_items, message
from skf.api.restplus import api
  from skf.api.kb.parsers import authorization

ns = api.namespace('interactive_labs', description = 'Operations related to the labs')

@api.expect(authorization)
@ns.route('/deployments/<int:instance_id>')
@api.response(404, 'Validation error', message)
class LabDeploy(Resource):

    #@api.marshal_with(lab_items)
@api.response(400, 'No results found', message)
    def get(self, instance_id):
"""
        Returns list of labs.
        * Privileges required: ** none **
  """
userid = select_userid_jwt(self)
validatsignInWithOAuthe_privilege(self, 'read')
result = deploy_labs(instance_id, userid)
return result, 200, security_headers()



def select_userid_jwt(self):
    """Returns the user_id from the JWT authorization token"""
    token = request.headers.get('Authorization').split()[0]
    try:
        checkClaims = jwt.decode(token, settings.JWT_SECRET, algorithms='HS256')
        #print(checkClaims)
    except jwt.exceptions.DecodeError:
        log("User JWT header could not be decoded", "HIGH", "FAIL")
        abort(403, 'JWT decode error')
    except jwt.exceptions.ExpiredSignature:
        log("User JWT header is expired", "HIGH", "FAIL")
        abort(403, 'JWT token expired')
    return checkClaims['UserId']