<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output indent="no" omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->

  <xsl:template match="iomap/firmware_version/control_board">
	<xsl:copy>
	   <xsl:value-of select="'2.27.4'"/>
	</xsl:copy>
  </xsl:template> 
  
  <xsl:template match="iomap/hard_limits[@index='0']/io[@module='JASPER']/limit_input/@bit">  
    <xsl:attribute name="bit">
	    <xsl:value-of select="'0'"/>
    </xsl:attribute>
  </xsl:template>

  <xsl:template match="iomap/hard_limits[@index='1']/io[@module='JASPER']/limit_input/@bit">  
    <xsl:attribute name="bit">
	    <xsl:value-of select="'1'"/>
    </xsl:attribute>
  </xsl:template> 

  <xsl:template match="iomap/hard_limits[@index='2']/io[@module='JASPER']/limit_input/@bit">  
    <xsl:attribute name="bit">
	    <xsl:value-of select="'2'"/>
    </xsl:attribute>
  </xsl:template> 

  <xsl:template match="iomap/hard_limits[@index='3']/io[@module='JASPER']/limit_input/@bit">  
    <xsl:attribute name="bit">
	    <xsl:value-of select="'3'"/>
    </xsl:attribute>
  </xsl:template>   

  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>