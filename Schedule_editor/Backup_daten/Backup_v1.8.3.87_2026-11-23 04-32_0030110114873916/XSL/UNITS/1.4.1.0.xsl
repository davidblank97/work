<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->
  <xsl:template match="UnitData/groups">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
      <gas_flow name="GAS FLOW"/>
    </xsl:copy>
  </xsl:template>

  <xsl:template match="UnitData/types/flow/liters_per_minute/conversion">
    <xsl:copy>
      <xsl:value-of select="'0.00440287'"/>
    </xsl:copy>
  </xsl:template> 

  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>