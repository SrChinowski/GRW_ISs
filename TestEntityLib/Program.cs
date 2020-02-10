using EntityLib;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestEntityLib
{
    class Program
    {
        static void Main(string[] args)
        {
            string strConn = "Server=DESKTOP-6IN4QVV;Database=Antera;Trusted_Connection=True;";
            Program.selectRecord(strConn);
        }

        static void selectRecord(string strConn)
        {
            Entity Customer = new Entity("Customer");
            Customer.connStr = strConn;
            // Customer.Attributes.Add(new EntityLib.Attribute("CustId","4","string"));
            Customer.Attributes.Add(new EntityLib.Attribute("Name"));
            List<GroupWhere> lGWhere = new List<GroupWhere>();
            List<Where> lWhere = new List<Where>();
            Where where = new Where("CustId", "4", "string",whereOperator.Equal);
            lWhere.Add(where);
            
            GroupWhere gw = new GroupWhere();
            //gw.LogicalOperatorWhere = logicalOperator.And;
            //gw.LogicalOperatorGroup= logicalOperator.And;
            gw.listWhere = lWhere;

            lGWhere.Add(gw);
            Customer.GroupWheres = lGWhere;
            var res= Customer.selectRecord();
            //Customer.DeleteRecord();




            //Entity InventTable = new Entity("Customer");
            //InventTable.connStr = strConn;
            //InventTable.Attributes.Add(new EntityLib.Attribute("CustId"));
            //InventTable.Attributes.Add(new EntityLib.Attribute("Name"));


            //Entity PalletType = new Entity("Territory");
            //PalletType.Attributes.Add(new EntityLib.Attribute("Name"));

            //JoinEntity joinEntity = new JoinEntity();
            //joinEntity.ChildEntity = PalletType;
            //joinEntity.JoinType = JoinType.Inner;

            //selectJoinEntity selectJoin = new selectJoinEntity("TerritoryId", logicalOperator.And, "TerritoryId");

            //joinEntity.selectJoinList.Add(selectJoin);

            //InventTable.ChildEntities.Add(joinEntity);

            //OperationResult opRes = InventTable.selectRecord();



            //Entity InventTable = new Entity("InventTable");
            //InventTable.connStr = strConn;
            //InventTable.Attributes.Add(new EntityLib.Attribute("ItemId"));
            //InventTable.Attributes.Add(new EntityLib.Attribute("BoxId"));
            //InventTable.Attributes.Add(new EntityLib.Attribute("PalletType"));
            //InventTable.Attributes.Add(new EntityLib.Attribute("Description"));
            //InventTable.Attributes.Add(new EntityLib.Attribute("ItemId"));

            //Entity PalletType = new Entity("PalletType");
            //PalletType.Attributes.Add(new EntityLib.Attribute("Name"));

            //JoinEntity joinEntity = new JoinEntity();
            //joinEntity.ChildEntity = PalletType;
            //joinEntity.JoinType = JoinType.Inner;

            //selectJoinEntity selectJoin = new selectJoinEntity("PalletType", logicalOperator.And, "PalletType");

            //joinEntity.selectJoinList.Add(selectJoin);

            //InventTable.ChildEntities.Add(joinEntity);

            //OperationResult opRes = InventTable.selectRecord();
        }
    }
}
