<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->


  <xsl:template match="peripheral/devices/camera/sync_trigger/@mode" >
    <xsl:attribute name="mode">
	    <xsl:value-of select="'bkg'"/>
    </xsl:attribute>
  </xsl:template>
  <xsl:template match="peripheral/devices/camera/sync_trigger/@frequency" >
    <xsl:attribute name="frequency">
	    <xsl:value-of select="'20'"/>
    </xsl:attribute>
  </xsl:template>

  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>