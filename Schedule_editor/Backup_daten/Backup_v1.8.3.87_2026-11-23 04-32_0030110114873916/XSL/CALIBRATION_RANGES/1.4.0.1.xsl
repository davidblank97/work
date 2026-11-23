<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->

  <xsl:template match="calibration_ranges/setpoint/offset/range[@type='valid']/@max">  
    <xsl:attribute name="max">
	    <xsl:value-of select="'0.2'"/>
    </xsl:attribute>
  </xsl:template>

  <xsl:template match="calibration_ranges/setpoint/offset/range[@type='warning']/@max">  
    <xsl:attribute name="max">
	    <xsl:value-of select="'0.3'"/>
    </xsl:attribute>
  </xsl:template>

  <xsl:template match="calibration_ranges/telemetry/offset/range[@type='valid']/@max">  
    <xsl:attribute name="max">
	    <xsl:value-of select="'0.2'"/>
    </xsl:attribute>
  </xsl:template>

  <xsl:template match="calibration_ranges/telemetry/offset/range[@type='warning']/@max">  
    <xsl:attribute name="max">
	    <xsl:value-of select="'0.3'"/>
    </xsl:attribute>
  </xsl:template>

  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>