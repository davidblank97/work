<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output indent="no" omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->

	<xsl:template match="/iomap/*[last()]">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="./io[@module='JASPER']">
				<hard_limits index="0">
					<io module="JASPER">
						<limit_input offset="40" bit="1"/>
					</io>
				</hard_limits>
				<hard_limits index="1">
					<io module="JASPER">
						<limit_input offset="40" bit="2"/>
					</io>
				</hard_limits>
				<hard_limits index="2">
					<io module="JASPER">
						<limit_input offset="40" bit="3"/>
					</io>
				</hard_limits>
				<hard_limits index="3">
					<io module="JASPER">
						<limit_input offset="40" bit="4"/>
					</io>
				</hard_limits>
			</xsl:when>
		</xsl:choose>
	</xsl:template> 

  <xsl:template match="iomap/firmware_version/servo_board">
	<xsl:copy>
	   <xsl:value-of select="'2.31.1'"/>
	</xsl:copy>
  </xsl:template> 

  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>