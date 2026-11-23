<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output indent="no" omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->
  <xsl:template match="config/mig_pulse" /> 

  <xsl:template match="config/power[@type='MIG']/open_circuit_amps"/>
  <xsl:template match="config/power[@type='MIG']/allowed_arc_out_counts"/>

  <xsl:template match="config/power[@type='MIG']/*[last()]">
    <xsl:choose>
     <xsl:when test="/config/power[@type='MIG']/open_circuit_amps">
	<xsl:copy-of select="/config/power[@type='MIG']/open_circuit_amps"/>
     </xsl:when>
     <xsl:otherwise></xsl:otherwise>
    </xsl:choose>

    <xsl:choose>
     <xsl:when test="/config/power[@type='MIG']/allowed_arc_out_counts">
	<xsl:copy-of select="/config/power[@type='MIG']/allowed_arc_out_counts"/>
     </xsl:when>
     <xsl:otherwise></xsl:otherwise>
    </xsl:choose>

    <xsl:choose>
     <xsl:when test="/config/power[@type='MIG']/telem_amps">
	<xsl:copy-of select="/config/power[@type='MIG']/telem_amps"/>
     </xsl:when>
     <xsl:otherwise></xsl:otherwise>
    </xsl:choose>
  </xsl:template> 

  <xsl:template match="config/hotwire/telem_amps"/>
  <xsl:template match="config/hotwire/*[last()]">
    <xsl:copy-of select="."/>
    <xsl:choose>
     <xsl:when test="/config/hotwire/telem_amps">
	<xsl:copy-of select="/config/hotwire/telem_amps"/>
     </xsl:when>
     <xsl:otherwise></xsl:otherwise>
    </xsl:choose>
  </xsl:template> 

  <xsl:template match="config/pilot/telem_amps"/>
  <xsl:template match="config/pilot/*[last()]">
    <xsl:copy-of select="."/>
    <xsl:choose>
     <xsl:when test="/config/pilot/telem_amps">
	<xsl:copy-of select="/config/pilot/telem_amps"/>
     </xsl:when>
     <xsl:otherwise></xsl:otherwise>
    </xsl:choose>
  </xsl:template> 

  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>