using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Configuration;
using EntityLib;

namespace CognisoWA.Controllers
{
    public class IncomingMessageController : ApiController
    {
        [Route("api/IncomingMessage/GetList")]
        [HttpPost]
        public List<OperationResult> GetList(List<Entity> _entities)
        {
            List<OperationResult> listResult = new List<OperationResult>();
            foreach (Entity entity in _entities)
            {
                Entity tmpEntity = entity;
                tmpEntity.connStr = this.getDbConn();
                OperationResult opResult = tmpEntity.selectRecord();
                if (opResult.Success)
                {
                    listResult.Add(opResult);
                }
            }

            return listResult; 
        }

        [Route("api/IncomingMessage/GetEntity")]
        [HttpPost]
        public OperationResult GetEntity(Entity _entity)
        {
            _entity.connStr = this.getDbConn();
            return _entity.selectRecord();
        }
        
        public OperationResult Post(Entity _entity)
        {
            _entity.connStr = this.getDbConn();
            Entity entity = Entity.construct(_entity);
            return entity.InsertRecord();

        }
        [Route("api/IncomingMessage/DeleteEntity")]
        [HttpPost]
        public OperationResult Delete(Entity _entity)
        {
            _entity.connStr = this.getDbConn();
            return _entity.DeleteRecord();
        }

        public OperationResult Put(Entity _entity)
        {
            _entity.connStr = this.getDbConn();
            return _entity.UpdateRecord();
        }

        private string getDbConn()
        {
            return ConfigurationManager.ConnectionStrings["DBConn"].ConnectionString;
        }
    }
}
