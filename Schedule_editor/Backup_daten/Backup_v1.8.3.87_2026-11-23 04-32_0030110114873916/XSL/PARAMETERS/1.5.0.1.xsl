<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output  omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->

  <xsl:template match="/Parameters">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
        <param id="200233">
          <name>ENABLE MQTT SERVICE</name>
          <short_name></short_name>
          <desc>A setting that enables/disables the MQTT service.</desc>
        </param>
    </xsl:copy>
  </xsl:template>

  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>