<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/iomap/system/io[@module='ADAM']/motion_pulse_setpoint_index" />

	<xsl:template match="iomap/system/io[@module='ADAM']/*[last()]">
	    <xsl:if test="name(.) != 'motion_pulse_setpoint_index'">
        	  <xsl:copy-of select="."/>
	    </xsl:if>
	    <motion_pulse_setpoint offset="25" />
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>